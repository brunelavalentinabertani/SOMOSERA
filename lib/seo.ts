export const SITE_URL = "https://www.somosera.com.ar";
export const SITE_NAME = "Somos Era";

const PRODUCT_ID_PATTERN = /([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function productPath(product: { id: string; name: string }) {
  return `/products/${slugify(product.name) || "producto"}--${product.id}`;
}

export function extractProductId(value: string) {
  return value.match(PRODUCT_ID_PATTERN)?.[1] ?? null;
}

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function seoDescription(value?: string | null, fallback?: string) {
  const text = (value || fallback || "Tecnología original con envíos a todo el país y retiro en Palermo.")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 158 ? `${text.slice(0, 155).trimEnd()}...` : text;
}
