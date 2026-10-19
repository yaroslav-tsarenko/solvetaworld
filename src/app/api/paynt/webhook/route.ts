import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendOrderInvoiceEmail } from "@/lib/email";
import { scheduleEmail } from "@/lib/email-jobs";
import { getPaymentStatus, isPaymentSuccessful } from "@/lib/paynt";

/**
 * Server-to-Server Webhook handler for PayNT / OPPWA.
 * Protects against scenarios where shopper closes 3DS tab before return redirect.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ error: "Empty webhook payload" }, { status: 400 });
    }

    console.log("PayNT Webhook received payload:", JSON.stringify(body));

    const resourcePath = body.resourcePath || body.payload?.resourcePath;
    const checkoutId = body.id || body.checkoutId || body.payload?.id;
    const merchantTransactionId = body.merchantTransactionId || body.payload?.merchantTransactionId;

    let paymentData = body;
    if (resourcePath) {
      paymentData = await getPaymentStatus(resourcePath);
    }

    const orderNumber = paymentData.merchantTransactionId || merchantTransactionId;
    const paymentId = paymentData.id || checkoutId;

    if (!orderNumber && !paymentId) {
      return NextResponse.json(
        { error: "Could not identify order from webhook" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          ...(orderNumber ? [{ orderNumber }] : []),
          ...(paymentId ? [{ paymentId }] : []),
        ],
      },
      include: { items: true },
    });

    if (!order) {
      console.warn("PayNT Webhook: Order not found for reference:", { orderNumber, paymentId });
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Idempotency: skip if already marked as paid
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ success: true, message: "Order already marked as PAID" });
    }

    const isSuccess = isPaymentSuccessful(paymentData?.result?.code);

    if (isSuccess) {
      const paidAmount = Number(paymentData.amount || order.total);
      const paidCurrency = paymentData.currency || "GBP";
      const conversionRate = Number(order.total) > 0 ? paidAmount / Number(order.total) : 1;

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

        fetch("https://hub.horolska.lv/api/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${hubToken}`,
          },
          body: JSON.stringify(hubPayload),
        }).catch((err) => {
          console.error("Horolska Hub webhook failed from webhook handler:", err);
        });
      }

      // Schedule customer confirmation emails
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

      scheduleEmail(`order confirmation ${updatedOrder.orderNumber}`, () =>
        sendOrderConfirmationEmail(emailPayload)
      );
      scheduleEmail(`order invoice ${updatedOrder.orderNumber}`, () =>
        sendOrderInvoiceEmail(emailPayload)
      );

      return NextResponse.json({ success: true, orderId: updatedOrder.id });
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" },
      });
      return NextResponse.json({ success: false, code: paymentData?.result?.code });
    }
  } catch (error: any) {
    console.error("PayNT Webhook error:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
