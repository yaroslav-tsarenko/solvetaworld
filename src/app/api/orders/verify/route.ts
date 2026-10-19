import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendOrderInvoiceEmail } from "@/lib/email";
import { scheduleEmail } from "@/lib/email-jobs";
import { getPaymentStatus, isPaymentSuccessful, isPaymentPending } from "@/lib/paynt";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resourcePath = searchParams.get("resourcePath");
    const orderId = searchParams.get("orderId");
    const checkoutId = searchParams.get("checkoutId") || searchParams.get("id");
    const paymentLinkId = searchParams.get("paymentLinkId");

    if (!resourcePath && (!paymentLinkId || !checkoutId)) {
      return NextResponse.json(
        { error: "resourcePath or (paymentLinkId and checkoutId) is required" },
        { status: 400 }
      );
    }

    // Find the order by orderId, paymentId (checkoutId or paymentLinkId)
    let order = null;
    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
    }

    if (!order && checkoutId) {
      order = await prisma.order.findFirst({
        where: { paymentId: checkoutId },
        include: { items: true },
      });
    }

    if (!order && paymentLinkId) {
      order = await prisma.order.findFirst({
        where: { paymentId: paymentLinkId },
        include: { items: true },
      });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Idempotency: If order is already paid, return it immediately to avoid duplicate processing
    if (order.paymentStatus === "PAID") {
      return NextResponse.json(order);
    }

    let paymentData: any = null;

    if (resourcePath) {
      // Call PayNT / OPPWA Copy & Pay status verification
      paymentData = await getPaymentStatus(resourcePath);
    } else {
      // Legacy Pay By Link status verification fallback
      const entityId = process.env.PAYBYLINK_ENTITY_ID || process.env.PAYNT_ENTITY_ID || "";
      const baseUrl = process.env.PAYBYLINK_BASE_URL || process.env.PAYNT_BASE_URL || "https://eu-test.oppwa.com";
      const statusUrl = `${baseUrl}/paybylink/v1/${paymentLinkId}/checkouts/${checkoutId}/payment?entityId=${entityId}`;

      const token = process.env.PAYBYLINK_AUTH_TOKEN || process.env.PAYNT_BEARER_TOKEN || "";
      const response = await fetch(statusUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Pay By Link status check error:", response.status, errorText);
        return NextResponse.json(
          { error: "Failed to verify payment status with provider" },
          { status: 502 }
        );
      }
      paymentData = await response.json();
    }

    console.log("PayNT/OPPWA verification response:", JSON.stringify(paymentData));

    const isSuccess = isPaymentSuccessful(paymentData?.result?.code);
    const isPending = isPaymentPending(paymentData?.result?.code);

    if (isSuccess) {
      // Get exact amount and currency paid from Oppwa
      const paidAmount = Number(paymentData.amount || order.total);
      const paidCurrency = paymentData.currency || "GBP";
      const conversionRate = Number(order.total) > 0 ? (paidAmount / Number(order.total)) : 1;

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
        },
        include: { items: true },
      });

      // Send order to Horolska Hub Webhook
      const hubToken = process.env.HOROLSKA_HUB_TOKEN;
      if (hubToken) {
        const shipping = (updatedOrder.shippingAddress as any) || {};
        const hubPayload = {
          site_name: "Solvetaworld",
          site_url: "https://www.solvetaworld.com/",
          order_id: updatedOrder.id,
          admin_url: "",
          billing: {
            first_name: shipping.firstName || "",
            last_name: shipping.lastName || "",
            email: updatedOrder.customerEmail || "",
            phone: updatedOrder.customerPhone || "",
            address_1: shipping.address1 || "",
            address_2: shipping.address2 || "",
            city: shipping.city || "",
            state: shipping.province || "",
            postcode: shipping.postalCode || "",
            country: shipping.country || "",
          },
          items: updatedOrder.items.map((item) => ({
            name: item.productName,
            qty: item.quantity,
            price: Number((Number(item.price) * conversionRate).toFixed(2)),
            total: Number((Number(item.total) * conversionRate).toFixed(2)),
          })),
          total: Number(paidAmount.toFixed(2)),
          currency: paidCurrency,
        };

        console.log("Sending order webhook to Horolska Hub from verify route...");
        fetch("https://hub.horolska.lv/api/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${hubToken}`,
          },
          body: JSON.stringify(hubPayload),
        })
          .then(async (res) => {
            if (!res.ok) {
              const errText = await res.text();
              console.error("Horolska Hub webhook failed in verify:", res.status, errText);
            } else {
              console.log("Horolska Hub webhook sent successfully in verify");
            }
          })
          .catch((err) => {
            console.error("Error sending Horolska Hub webhook in verify:", err);
          });
      }

      // Send confirmation & invoice emails
      const emailPayload = {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        customerEmail: updatedOrder.customerEmail,
        items: updatedOrder.items,
        subtotal: updatedOrder.subtotal,
        taxAmount: updatedOrder.taxAmount,
        shippingCost: updatedOrder.shippingCost,
        discountAmount: updatedOrder.discountAmount,
        total: updatedOrder.total,
        shippingMethod: updatedOrder.shippingMethod || "standard",
        shippingAddress: updatedOrder.shippingAddress as any,
        createdAt: updatedOrder.createdAt,
      };

      scheduleEmail(`order confirmation ${updatedOrder.orderNumber}`, () => sendOrderConfirmationEmail(emailPayload));
      scheduleEmail(`order invoice ${updatedOrder.orderNumber}`, () => sendOrderInvoiceEmail(emailPayload));

      return NextResponse.json(updatedOrder);
    } else if (isPending) {
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PENDING",
        },
        include: { items: true },
      });
      return NextResponse.json(updatedOrder);
    } else {
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "FAILED",
        },
        include: { items: true },
      });
      return NextResponse.json(updatedOrder);
    }
  } catch (error) {
    console.error("Error verifying order payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
