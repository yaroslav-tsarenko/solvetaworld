import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validators/checkout";
import { getSessionUser } from "@/lib/auth";
import { sendOrderConfirmationEmail, sendOrderInvoiceEmail } from "@/lib/email";
import { scheduleEmail } from "@/lib/email-jobs";
import { resolveDiscount, markDiscountUsed } from "@/lib/discounts";
import { shippingCost as shippingCostFor } from "@/lib/shipping";
import { getGbpRates, convertFromGbp, isSupportedCurrency, type ChargeCurrency } from "@/lib/exchange-rates";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();

    const body = await request.json();
    const validated = checkoutSchema.parse(body);
    const { items, locale } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!validated.contact.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!validated.acceptedPolicies) {
      return NextResponse.json(
        { error: "Terms and Conditions and Privacy Policy must be accepted" },
        { status: 400 },
      );
    }

    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems = items.map((item: { productId: string; quantity: number; variantName?: string }) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      return {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        variantName: item.variantName || null,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      };
    });

    const discount = await resolveDiscount({
      userId: user?.id ?? null,
      email: validated.contact.email,
      code: validated.discountCode ?? null,
    });

    const discountAmount = discount ? +(subtotal * (discount.percent / 100)).toFixed(2) : 0;
    const discountedSubtotal = subtotal - discountAmount;

    const settings = await prisma.storeSettings.findFirst();
    // Product prices and delivery charges are stored in GBP (the store's base
    // currency); anything else is a conversion of the GBP total.
    const currencyCookie = request.cookies.get("currency")?.value;
    const selectedCurrency: ChargeCurrency = isSupportedCurrency(body.currency)
      ? body.currency
      : isSupportedCurrency(currencyCookie)
        ? currencyCookie
        : "GBP";

    const taxRate = Number(settings?.taxRate ?? 21);
    const taxAmount = +(discountedSubtotal * (taxRate / 100)).toFixed(2);
    // Delivery terms live in src/lib/shipping.ts (DB freeShippingMin is ignored).
    const shippingCost = shippingCostFor(validated.shippingMethod, discountedSubtotal);
    const total = +(discountedSubtotal + taxAmount + shippingCost).toFixed(2);

    // Convert to the shopper's currency with the same GBP-based rates and
    // rounding the storefront uses, so the charged amount equals the displayed one.
    const rates = await getGbpRates();
    const totalInSelectedCurrency = convertFromGbp(total, selectedCurrency, rates);

    const order = await prisma.order.create({
      data: {
        user: user?.id ? { connect: { id: user.id } } : undefined,
        customerName: `${validated.shipping.firstName} ${validated.shipping.lastName}`,
        customerEmail: validated.contact.email,
        customerPhone: validated.contact.phone,
        shippingAddress: validated.shipping,
        shippingMethod: validated.shippingMethod,
        shippingCost,
        subtotal,
        taxAmount,
        discountAmount,
        discountCode: discount?.code ?? null,
        discountPercent: discount?.percent ?? null,
        total,
        paymentMethod: "paybylink",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    if (discount) {
      await markDiscountUsed(discount, user?.id ?? null);
    }

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    // Oppwa base URL
    const baseUrl = process.env.PAYBYLINK_BASE_URL || "https://eu-test.oppwa.com";

    // Call Pay By Link API to generate hosted payment page link
    const params = new URLSearchParams();
    params.append("entityId", process.env.PAYBYLINK_ENTITY_ID || "");
    params.append("amount", totalInSelectedCurrency.toFixed(2));
    params.append("currency", selectedCurrency);
    params.append("paymentType", "DB");
    params.append("merchantTransactionId", order.orderNumber);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4554";
    const localizedPath = locale ? `/${locale}/order/confirmed` : "/order/confirmed";
    params.append("shopperResultUrl", `${siteUrl}${localizedPath}`);

    params.append("customer.givenName", validated.shipping.firstName);
    params.append("customer.surname", validated.shipping.lastName);
    params.append("customer.email", validated.contact.email);
    if (validated.contact.phone) {
      params.append("customer.mobile", validated.contact.phone);
    }

    params.append("collectBilling", "street1,postcode,city,country");
    params.append("mandatoryBilling", "street1,postcode,city,country");
    params.append("billing.street1", validated.shipping.address1);
    params.append("billing.city", validated.shipping.city);
    params.append("billing.postcode", validated.shipping.postalCode);
    params.append("billing.country", validated.shipping.country);

    order.items.forEach((item, index) => {
      params.append(`cart.items[${index}].currency`, selectedCurrency);
      params.append(`cart.items[${index}].description`, item.productName);
      params.append(`cart.items[${index}].merchantItemId`, item.productId);
      params.append(`cart.items[${index}].name`, item.productName);
      params.append(`cart.items[${index}].price`, convertFromGbp(Number(item.price), selectedCurrency, rates).toFixed(2));
      params.append(`cart.items[${index}].quantity`, String(item.quantity));
      params.append(`cart.items[${index}].totalAmount`, convertFromGbp(Number(item.total), selectedCurrency, rates).toFixed(2));
    });

    const paybyLinkUrl = `${baseUrl}/paybylink/v1`;
    console.log("Oppwa Pay By Link Request URL:", paybyLinkUrl);
    console.log("Oppwa Pay By Link Request Body:", params.toString());

    const response = await fetch(paybyLinkUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${process.env.PAYBYLINK_AUTH_TOKEN}`,
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pay By Link API error status:", response.status, "body:", errorText);
      throw new Error(`Failed to generate payment link: ${errorText}`);
    }

    const payLinkData = await response.json();

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: payLinkData.id,
      },
      include: { items: true },
    });

    return NextResponse.json({ ...updatedOrder, paymentLink: payLinkData.link }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({
      error: "Failed to create order",
      details: error.message || String(error),
      stack: error.stack
    }, { status: 500 });
  }
}
