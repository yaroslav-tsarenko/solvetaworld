import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EXPRESS_PRICE, FREE_STANDARD_MIN, STANDARD_PRICE, formatGbp } from "@/lib/shipping";

export async function POST() {
  try {
    // Seed defaults for the admin-managed homepage blocks. The storefront home
    // page no longer renders these blocks; they remain editable in the admin
    // and are seeded with copy that matches the "Bold Utility" storefront.

    // ── Utility Links ──────────────────────────────────
    const utilityLinks = [
      { label: "Who we are", linkUrl: "/about", icon: "Info", position: "left", sortOrder: 0 },
      { label: "Delivery & dispatch", linkUrl: "/policies/shipping", icon: "Truck", position: "left", sortOrder: 1 },
      { label: "Returns & refunds", linkUrl: "/policies/returns", icon: "RotateCcw", position: "left", sortOrder: 2 },
      { label: "Help desk", linkUrl: "/faq", icon: "HelpCircle", position: "left", sortOrder: 3 },
      { label: "Track an order", linkUrl: "/account/orders", icon: "Package", position: "left", sortOrder: 4 },
      { label: "Talk to the team", linkUrl: "/contact", icon: "Phone", position: "right", sortOrder: 5 },
    ];

    for (const link of utilityLinks) {
      await prisma.utilityLink.upsert({
        where: { id: `seed-utility-${link.sortOrder}` },
        update: link,
        create: { id: `seed-utility-${link.sortOrder}`, ...link },
      });
    }

    // ── Promo Strip Items ──────────────────────────────
    const promoStripItems = [
      {
        icon: "Truck",
        title: `Free standard delivery on ${formatGbp(FREE_STANDARD_MIN)} or more`,
        subtitle: `Otherwise ${formatGbp(STANDARD_PRICE)}; express ${formatGbp(EXPRESS_PRICE)}`,
        sortOrder: 0,
      },
      { icon: "RotateCcw", title: "14 days to return it", subtitle: "Unused, in original packaging", sortOrder: 1 },
      { icon: "Shield", title: "2-year guarantee", subtitle: "Extra cover available on eligible items", sortOrder: 2 },
      { icon: "CreditCard", title: "Card payments", subtitle: "Visa and Mastercard", sortOrder: 3 },
    ];

    for (const item of promoStripItems) {
      await prisma.promoStripItem.upsert({
        where: { id: `seed-promo-${item.sortOrder}` },
        update: item,
        create: { id: `seed-promo-${item.sortOrder}`, ...item },
      });
    }

    // ── Homepage Tabs ──────────────────────────────────
    const tabs = [
      { label: "Price cuts", icon: "Tag", linkUrl: "/catalog?onSale=true", color: "#111111", sortOrder: 0 },
      { label: "Hand & power tools", icon: "Wrench", linkUrl: "/catalog/manual-and-electric-tools", color: "#111111", sortOrder: 1 },
      { label: "Ironmongery", icon: "Key", linkUrl: "/catalog/ironmongery", color: "#111111", sortOrder: 2 },
      { label: "Garden machinery", icon: "Leaf", linkUrl: "/catalog/lawnmowers-and-outdoor-electric-tools", color: "#111111", sortOrder: 3 },
      { label: "Cable & wiring", icon: "Cable", linkUrl: "/catalog/electrical-wiring", color: "#111111", sortOrder: 4 },
      { label: "Test & measurement", icon: "Gauge", linkUrl: "/catalog/testing-and-measuring", color: "#111111", sortOrder: 5 },
      { label: "Just in", icon: "Sparkles", linkUrl: "/catalog?sort=newest", color: "#111111", sortOrder: 6 },
    ];

    for (const tab of tabs) {
      await prisma.homepageTab.upsert({
        where: { id: `seed-tab-${tab.sortOrder}` },
        update: tab,
        create: { id: `seed-tab-${tab.sortOrder}`, ...tab },
      });
    }

    // ── Hero Slides (Banners type HERO) ────────────────
    const heroSlides = [
      {
        type: "HERO" as const,
        title: "Tools & hardware for the job in hand",
        subtitle: "Hand and power tools, ironmongery, cable and test gear",
        description: "Search the catalogue by name, brand or SKU.",
        linkUrl: "/catalog",
        ctaLabel: "Browse departments",
        bgColor: "#FFD21F",
        textColor: "#111111",
        badgeText: "CATALOGUE",
        sortOrder: 0,
      },
      {
        type: "HERO" as const,
        title: "Garden machinery",
        subtitle: "Mowers, trimmers and outdoor power tools",
        description: "Everything filed under the garden machinery department.",
        linkUrl: "/catalog/lawnmowers-and-outdoor-electric-tools",
        ctaLabel: "Open department",
        bgColor: "#111111",
        textColor: "#FFFFFF",
        badgeText: "DEPARTMENT",
        sortOrder: 1,
      },
    ];

    for (let i = 0; i < heroSlides.length; i++) {
      await prisma.banner.upsert({
        where: { id: `seed-hero-${i}` },
        update: heroSlides[i],
        create: { id: `seed-hero-${i}`, ...heroSlides[i] },
      });
    }

    // ── Deal Cards (Banners type DEAL_CARD) ────────────
    // Deal cards carry prices, so none are seeded: add real ones in the admin.
    const dealCards: unknown[] = [];

    // ── Small Promo Banners ────────────────────────────
    const smallPromos = [
      {
        type: "PROMO_SMALL" as const,
        title: "Ironmongery",
        subtitle: "Hinges, locks, fixings and fittings",
        linkUrl: "/catalog/ironmongery",
        ctaLabel: "Open",
        bgColor: "#F4F4F2",
        textColor: "#111111",
        sortOrder: 0,
      },
      {
        type: "PROMO_SMALL" as const,
        title: "Cable & wiring",
        subtitle: "Cable, connectors and accessories",
        linkUrl: "/catalog/electrical-wiring",
        ctaLabel: "Open",
        bgColor: "#F4F4F2",
        textColor: "#111111",
        sortOrder: 1,
      },
      {
        type: "PROMO_SMALL" as const,
        title: "Test & measurement",
        subtitle: "Meters, testers and detectors",
        linkUrl: "/catalog/testing-and-measuring",
        ctaLabel: "Open",
        bgColor: "#F4F4F2",
        textColor: "#111111",
        sortOrder: 2,
      },
    ];

    for (let i = 0; i < smallPromos.length; i++) {
      await prisma.banner.upsert({
        where: { id: `seed-promo-small-${i}` },
        update: smallPromos[i],
        create: { id: `seed-promo-small-${i}`, ...smallPromos[i] },
      });
    }

    // ── Wide Promo Banner ──────────────────────────────
    const widePromo = {
      type: "PROMO_WIDE" as const,
      title: "Kitting out a job or a workshop?",
      subtitle: "Send us a parts list or a spec question",
      description: "Use the enquiry form and the team will reply by email.",
      linkUrl: "/contact",
      ctaLabel: "Talk to the team",
      bgColor: "#FFD21F",
      textColor: "#111111",
      badgeText: "ENQUIRIES",
      sortOrder: 0,
    };

    await prisma.banner.upsert({
      where: { id: "seed-promo-wide-0" },
      update: widePromo,
      create: { id: "seed-promo-wide-0", ...widePromo },
    });

    // ── Brands ─────────────────────────────────────────
    // Brand logos are not shipped with the store; seed no brand rows.
    const brands: string[] = [];

    // ── Homepage Sections ──────────────────────────────
    const sections = [
      {
        title: "Price cuts",
        subtitle: "Marked down from the original price",
        slug: "price-cuts",
        filterType: "onSale",
        maxProducts: 6,
        viewAllUrl: "/catalog?onSale=true",
        viewAllLabel: "See all price cuts",
        bgStyle: "white",
        columns: 6,
        sortOrder: 0,
      },
      {
        title: "Fresh on the shelf",
        subtitle: "Latest lines added",
        slug: "fresh-on-the-shelf",
        filterType: "newest",
        maxProducts: 6,
        viewAllUrl: "/catalog?sort=newest",
        viewAllLabel: "See everything new",
        bgStyle: "gray",
        columns: 6,
        sortOrder: 1,
      },
      {
        title: "Hand & power tools",
        subtitle: "From the tools department",
        slug: "hand-and-power-tools",
        filterType: "category",
        categorySlug: "manual-and-electric-tools",
        maxProducts: 6,
        viewAllUrl: "/catalog/manual-and-electric-tools",
        viewAllLabel: "Open department",
        bgStyle: "white",
        columns: 6,
        sortOrder: 2,
      },
    ];

    for (const section of sections) {
      await prisma.homepageSection.upsert({
        where: { slug: section.slug },
        update: section,
        create: section,
      });
    }

    return NextResponse.json({
      success: true,
      seeded: {
        utilityLinks: utilityLinks.length,
        promoStripItems: promoStripItems.length,
        tabs: tabs.length,
        heroSlides: heroSlides.length,
        dealCards: dealCards.length,
        smallPromos: smallPromos.length,
        widePromos: 1,
        brands: brands.length,
        sections: sections.length,
      },
    });
  } catch (error) {
    console.error("Error seeding homepage data:", error);
    return NextResponse.json({ error: "Failed to seed homepage data" }, { status: 500 });
  }
}
