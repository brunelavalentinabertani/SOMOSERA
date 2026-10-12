import type { Metadata } from "next";
import EraHeader from "../../components/layout/EraHeader";
import { isProductHidden } from "../../lib/catalogVisibility";
import {
  MOTHER_DAY_DISCOUNT_CODE,
  MOTHER_DAY_DISCOUNT_USD,
  isMotherDayDiscountEligibleProduct,
} from "../../lib/motherDayProducts";
import { supabase } from "../../lib/supabaseClient";
import type { Product } from "@/types/product";
import MotherDayProductsGrid from "./MotherDayProductsGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Regalos para mamá",
  description: "Encontrá Apple Watch, iPad, AirPods y celulares seleccionados para regalarle a mamá.",
  alternates: { canonical: "/felizdiamama" },
};

export default async function MotherDayGiftsPage() {
  const { data } = await supabase
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
    `);

  const products = ((data ?? []) as Product[])
    .filter((product) => !isProductHidden(product) && isMotherDayDiscountEligibleProduct(product))
    .sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen bg-era-white text-era-black">
      <EraHeader />

      <section className="border-y border-era-line bg-white">
        <div className="mx-auto max-w-[1420px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-era-orange">
            Una selección para ella
          </p>
          <h1 className="mt-4 max-w-[950px] text-[44px] font-black leading-[0.95] tracking-[-0.05em] sm:text-[62px] lg:text-[78px]">
            Encontrá el regalo perfecto acá<span className="text-era-orange"> *</span>
          </h1>
          <p className="mt-6 max-w-[720px] text-[19px] leading-7 text-era-text-muted sm:text-[23px]">
            ¡Feliz día Mamá! Elegí entre Apple Watch, iPad, AirPods y celulares Samsung, Motorola y Xiaomi.
          </p>
          <p className="mt-5 inline-flex rounded-[5px] bg-era-orange px-4 py-3 text-[14px] font-black text-white sm:text-[16px]">
            Usá {MOTHER_DAY_DISCOUNT_CODE} y ahorrá USD {MOTHER_DAY_DISCOUNT_USD}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1420px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <MotherDayProductsGrid products={products} />
      </section>
    </main>
  );
}
