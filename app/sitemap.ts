import type { MetadataRoute } from "next";
import { supabase } from "../lib/supabaseClient";
import { isProductHidden } from "../lib/catalogVisibility";
import { absoluteUrl, productPath } from "../lib/seo";

const categoryUrls = [
  "/products?brand=Apple&category=Iphones",
  "/products?brand=Apple&category=Macbooks",
  "/products?brand=Apple&category=Ipads",
  "/products?brand=Apple&category=Applewatch",
  "/products?brand=Apple&category=Imacs",
  "/products?brand=Samsung",
  "/products?brand=Xiaomi",
  "/products?brand=Motorola&category=Celulares",
  "/products?category=Accesorios",
  "/products?category=Foto%2FVideo",
  "/products?category=Gaming",
  "/products?category=Kindle",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase.from("products").select("id, name");
  const products = (data ?? []).filter((product) => !isProductHidden(product));

  return [
    { url: absoluteUrl("/"), priority: 1, changeFrequency: "daily" },
    { url: absoluteUrl("/nosotros"), priority: 0.6, changeFrequency: "monthly" },
    { url: absoluteUrl("/info"), priority: 0.6, changeFrequency: "monthly" },
    ...categoryUrls.map((url) => ({
      url: absoluteUrl(url),
      priority: 0.8,
      changeFrequency: "daily" as const,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(productPath(product)),
      priority: 0.9,
      changeFrequency: "daily" as const,
    })),
  ];
}
