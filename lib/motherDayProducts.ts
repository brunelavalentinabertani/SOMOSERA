import type { Product } from "@/types/product";
import { getProductDisplayPrice } from "./productSort";

export type MotherDayProductGroup = "Apple Watch" | "iPad" | "Celulares" | "AirPods";

export const MOTHER_DAY_DISCOUNT_CODE = "FELIZDIAMAMA";
export const MOTHER_DAY_DISCOUNT_USD = 35;

function normalize(value?: string | null) {
  return (value ?? "").trim().toLocaleLowerCase("es");
}

export function getMotherDayProductGroup(
  product: Pick<Product, "brand" | "category" | "name">,
): MotherDayProductGroup | null {
  const brand = normalize(product.brand);
  const category = normalize(product.category);
  const name = normalize(product.name);

  if (brand === "apple" && category === "applewatch") return "Apple Watch";
  if (brand === "apple" && category === "ipads") return "iPad";
  if (brand === "apple" && name.includes("airpods")) return "AirPods";

  if (
    category === "celulares" &&
    ["samsung", "motorola", "xiaomi"].includes(brand)
  ) {
    return "Celulares";
  }

  return null;
}

export function isMotherDayProduct(product: Pick<Product, "brand" | "category" | "name">) {
  return getMotherDayProductGroup(product) !== null;
}

export function isMotherDayDiscountEligibleProduct(product: Product) {
  const price = getProductDisplayPrice(product);
  return isMotherDayProduct(product) && price !== null && Number.isFinite(price) && price > 0;
}

export function hasProductImage(
  product: Pick<Product, "image_url" | "product_variants" | "products_colors">,
) {
  return Boolean(
    product.product_variants?.some((variant) => variant.image_url) ||
    product.products_colors?.some((color) => color.image_url) ||
    product.image_url,
  );
}
