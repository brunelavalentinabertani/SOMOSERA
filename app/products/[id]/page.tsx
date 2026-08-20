import { supabase } from "../../../lib/supabaseClient"
import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { cache } from "react"
import ProductDetail from "./ProductDetail"
import { Product } from "@/types/product"
import { isProductHidden } from "../../../lib/catalogVisibility"
import { absoluteUrl, extractProductId, productPath, seoDescription } from "../../../lib/seo"

export const dynamic = "force-dynamic"

const productSelect = `
  id,
  name,
  brand,
  category,
  description,
  image_url,
  usd_rate,
  price_usd,
  product_variants (
    id,
    color_name,
    color_hex,
    storage_gb,
    ram_gb,
    screen_inches,
    price_usd,
    image_url
  ),
  products_colors (
    id,
    name,
    hex,
    image_url
  )
`;

const getProduct = cache(async (routeId: string) => {
  const id = extractProductId(routeId);
  if (!id) return null;

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("id", id)
    .single<Product>();

  if (error || !data || isProductHidden(data)) return null;
  return data;
});

export async function generateStaticParams() {
  const { data } = await supabase
    .from("products")
    .select("id, name")

  return (data ?? []).filter((product) => !isProductHidden(product)).map((product) => ({
    id: productPath(product).split("/").pop()!,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Producto no encontrado", robots: { index: false, follow: false } };
  }

  const canonical = productPath(product);
  const description = seoDescription(
    product.description,
    `Comprá ${product.name} original en Somos Era. Envíos a todo el país y retiro en Palermo.`,
  );
  const image = product.image_url || product.product_variants.find((variant) => variant.image_url)?.image_url;

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: canonical,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id) {
    return notFound()
  }

  const data = await getProduct(id);
  if (!data) {
    return notFound()
  }

  const canonicalPath = productPath(data);
  if (`/products/${id}` !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }

  const { data: relatedProducts } = await supabase
    .from("products")
    .select(`
      id,
      name,
      brand,
      category,
      description,
      image_url,
      usd_rate,
      price_usd,
      product_variants (
        id,
        color_name,
        color_hex,
        storage_gb,
        ram_gb,
        screen_inches,
        price_usd,
        image_url
      ),
      products_colors (
        id,
        name,
        hex,
        image_url
      )
    `)
    .eq("category", data.category)
    .neq("id", data.id)

  const relatedWithImages = (relatedProducts ?? [])
    .filter((product) => !isProductHidden(product))
    .filter((product) =>
      Boolean(
        product.image_url ||
        product.product_variants?.some((variant) => variant.image_url) ||
        product.products_colors?.some((color) => color.image_url),
      ),
    )
    .slice(0, 5)

  const prices = [
    data.price_usd,
    ...data.product_variants.map((variant) => variant.price_usd),
  ].filter((price): price is number => typeof price === "number" && price > 0);
  const lowestPrice = prices.length ? Math.min(...prices) : null;
  const image = data.image_url || data.product_variants.find((variant) => variant.image_url)?.image_url;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: seoDescription(data.description),
    image: image ? [image] : undefined,
    sku: data.id,
    brand: { "@type": "Brand", name: data.brand },
    category: data.category,
    offers: lowestPrice ? {
      "@type": "Offer",
      url: absoluteUrl(canonicalPath),
      priceCurrency: "USD",
      price: lowestPrice,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
    } : undefined,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: data.category,
        item: absoluteUrl(`/products?category=${encodeURIComponent(data.category)}`),
      },
      { "@type": "ListItem", position: 3, name: data.name, item: absoluteUrl(canonicalPath) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ProductDetail product={data} relatedProducts={relatedWithImages} />
    </>
  )
}
