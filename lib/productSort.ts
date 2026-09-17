import type { Product } from "@/types/product";

export type ProductSortOrder = "" | "price-asc" | "price-desc";

export function getProductDisplayPrice(product: Product) {
  const variant = [...(product.product_variants ?? [])].sort((a, b) => {
    const storageDiff = (a.storage_gb ?? 0) - (b.storage_gb ?? 0);
    return storageDiff || (a.ram_gb ?? 0) - (b.ram_gb ?? 0);
  })[0];

  return variant ? variant.price_usd : product.price_usd ?? null;
}

export function sortProductsByPrice(products: Product[], order: ProductSortOrder) {
  if (!order) return products;

  return products
    .map((product) => ({ product, price: getProductDisplayPrice(product) }))
    .sort((a, b) => {
      const aHasPrice = a.price !== null && Number.isFinite(a.price) && a.price > 0;
      const bHasPrice = b.price !== null && Number.isFinite(b.price) && b.price > 0;
      if (!aHasPrice && !bHasPrice) return 0;
      if (!aHasPrice) return 1;
      if (!bHasPrice) return -1;
      return order === "price-asc" ? a.price! - b.price! : b.price! - a.price!;
    })
    .map(({ product }) => product);
}
