import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validators/checkout";
import { getSessionUser } from "@/lib/auth";
import { resolveDiscount, markDiscountUsed } from "@/lib/discounts";
import { shippingCost as shippingCostFor } from "@/lib/shipping";
import { getGbpRates, convertFromGbp, isSupportedCurrency, type ChargeCurrency } from "@/lib/exchange-rates";
import { prepareCheckout, getClientIp } from "@/lib/paynt";

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
    const currencyCookie = request.cookies.get("currency")?.value;
    const selectedCurrency: ChargeCurrency = isSupportedCurrency(body.currency)
      ? body.currency
      : isSupportedCurrency(currencyCookie)
        ? currencyCookie
        : "GBP";

    const taxRate = Number(settings?.taxRate ?? 21);
    const taxAmount = +(discountedSubtotal * (taxRate / 100)).toFixed(2);
    const shippingCost = shippingCostFor(validated.shippingMethod, discountedSubtotal);
    const total = +(discountedSubtotal + taxAmount + shippingCost).toFixed(2);

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
        paymentMethod: "setopay",
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

    // Determine return URL for the shopper after checkout
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:1012";
    const localizedPath = locale ? `/${locale}/order/confirmed` : "/order/confirmed";
    const shopperResultUrl = `${siteUrl}${localizedPath}?orderId=${order.id}`;

    // Get client public IP for 3DS requirement
    const clientIp = getClientIp(request.headers);

    // Call PayNT / OPPWA Copy & Pay API (POST /v1/checkouts)
    const checkoutRes = await prepareCheckout({
      amount: totalInSelectedCurrency,
      currency: selectedCurrency,
      orderNumber: order.orderNumber,
      customer: {
        email: validated.contact.email,
        givenName: validated.shipping.firstName,
        surname: validated.shipping.lastName,
        phone: validated.contact.phone,
        ip: clientIp,
      },
      billing: {
        street1: validated.shipping.address1,
        city: validated.shipping.city,
        postcode: validated.shipping.postalCode,
        country: validated.shipping.country,
      },
      cartItems: order.items.map((item) => ({
        id: item.productId,
        name: item.productName,
        price: convertFromGbp(Number(item.price), selectedCurrency, rates),
        quantity: item.quantity,
        total: convertFromGbp(Number(item.total), selectedCurrency, rates),
        currency: selectedCurrency,
      })),
    });

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: checkoutRes.checkoutId,
      },
      include: { items: true },
    });

    return NextResponse.json(
      {
        ...updatedOrder,
        checkoutId: checkoutRes.checkoutId,
        integrity: checkoutRes.integrity,
        scriptUrl: checkoutRes.scriptUrl,
        shopperResultUrl,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({
      error: "Failed to create order",
      details: error.message || String(error),
      stack: error.stack
    }, { status: 500 });
  }
}

