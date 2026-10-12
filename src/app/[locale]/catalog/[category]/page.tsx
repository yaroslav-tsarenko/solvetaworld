import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";

export const revalidate = 60;

const PAGE_SIZE = 48;

interface CategoryPageProps {
  params: Promise<{ category: string; locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug }, select: { name: true, description: true } });
  if (!category) return {};
  return {
    title: `${category.name} — department`,
    description: category.description || `${category.name}: browse every line in this Solvetaworld department.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: slug } = await params;
  const { page: pageParam } = await searchParams;
  const t = await getTranslations("listing");
  const nav = await getTranslations("nav");

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      parent: { select: { name: true, slug: true } },
      children: {
        where: { isActive: true },
        select: { id: true, slug: true, name: true, _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!category) notFound();

  const categoryIds = [category.id, ...category.children.map((c) => c.id)];

  const productCategories = await prisma.productCategory.findMany({
    where: { categoryId: { in: categoryIds } },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
      },
    },
  });

  const seen = new Set<string>();
  const all = productCategories
    .map((pc) => pc.product)
    .filter((p) => {
      if (p.status !== "ACTIVE" || seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, parseInt(pageParam || "1", 10) || 1), totalPages);
  const products = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    brand: p.brand,
    price: Number(p.price),
    comparePrice: p.comparePrice != null ? Number(p.comparePrice) : null,
    quantity: p.quantity,
    lowStockAlert: p.lowStockAlert,
    images: p.images.map((img) => ({ url: img.url, alt: img.alt })),
  }));

  const crumbs = [
    { label: nav("home"), href: "/" },
    { label: t("catalogueTitle"), href: "/catalog" },
    ...(category.parent ? [{ label: category.parent.name, href: `/catalog/${category.parent.slug}` }] : []),
    { label: category.name },
  ];

  const pageHref = (n: number) => `/catalog/${category.slug}${n > 1 ? `?page=${n}` : ""}`;
  const pageBtn = "min-w-10 h-10 px-3 flex items-center justify-center border-2 border-line-strong font-display font-bold";

  return (
    <div className="max-w-container mx-auto px-4 lg:px-6 pb-16 [overflow-wrap:anywhere]">
      <Breadcrumbs items={crumbs} />

      <header className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-end pb-4 mb-5 border-b-4 border-line-strong">
        <div>
          <p className="u-cond m-0 text-sm font-bold tracking-[0.16em] text-ink-muted">{t("departmentEyebrow")}</p>
          <h1 className="m-0 mt-1 text-[3rem] max-sm:text-[2.1rem] leading-none text-ink">{category.name}</h1>
          {category.description && (
            <p className="m-0 mt-3 max-w-[70ch] text-[0.9375rem] text-ink-muted leading-relaxed">{category.description}</p>
          )}
        </div>
        <p className="m-0 bg-coal text-hivis px-4 py-2 font-display font-extrabold text-xl tabular-nums self-start lg:self-end">
          {t("lineCount", { count: all.length })}
        </p>
      </header>

      {category.children.length > 0 && (
        <nav aria-label={t("subDepartments")} className="mb-6">
          <ul className="list-none m-0 p-0 flex flex-wrap gap-2">
            {category.children.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/catalog/${c.slug}`}
                  className="inline-flex items-center gap-2 h-9 px-3 border-2 border-line-strong text-sm font-semibold hover:bg-hivis hover:text-coal"
                >
                  {c.name}
                  <span className="font-mono text-xs text-ink-subtle">{c._count.products}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <ProductGrid products={products} wide />

      {totalPages > 1 && (
        <nav className="flex justify-center items-center gap-1.5 mt-10 flex-wrap" aria-label={t("pagination")}>
          {page > 1 && <Link href={pageHref(page - 1)} className={`${pageBtn} hover:bg-hivis hover:text-coal u-cond`}>{t("prev")}</Link>}
          <span className={`${pageBtn} bg-coal text-hivis`}>{t("pageOf", { page, total: totalPages })}</span>
          {page < totalPages && <Link href={pageHref(page + 1)} className={`${pageBtn} hover:bg-hivis hover:text-coal u-cond`}>{t("next")}</Link>}
        </nav>
      )}
    </div>
  );
}
