import type { Metadata } from "next";
import EraHeader from "../../components/layout/EraHeader";
import { isProductHidden } from "../../lib/catalogVisibility";
import { getDiscountProductOrder, isDiscountEligibleProduct } from "../../lib/discountProducts";
import { supabase } from "../../lib/supabaseClient";
import type { Product } from "@/types/product";
import DiscountProductsGrid from "./DiscountProductsGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Equipos con código de descuento",
  description: "Conocé los equipos seleccionados que admiten código de descuento en Somos Era.",
  alternates: { canonical: "/equipos-con-descuento" },
};

export default async function DiscountProductsPage() {
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
    .filter((product) => !isProductHidden(product) && isDiscountEligibleProduct(product))
    .sort((a, b) => getDiscountProductOrder(a) - getDiscountProductOrder(b));

  return (
    <main className="min-h-screen bg-era-white text-era-black">
      <EraHeader />

      <section className="border-y border-era-line">
        <div className="mx-auto max-w-[1420px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-era-orange">
            Beneficio exclusivo
          </p>
          <h1 className="mt-4 max-w-[900px] text-[42px] font-black leading-none tracking-[-0.05em] sm:text-[58px] lg:text-[72px]">
            Equipos con código de descuento<span className="text-era-orange"> *</span>
          </h1>
          <p className="mt-6 max-w-[680px] text-[17px] leading-7 text-era-text-muted sm:text-[20px]">
            Explorá los productos seleccionados que admiten el uso de un código de descuento.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1420px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mb-7 flex items-center justify-between border-b border-era-line pb-5">
          <h2 className="text-[24px] font-black">Equipos seleccionados</h2>
          <p className="text-[13px] font-semibold text-era-text-muted">{products.length} productos</p>
        </div>
        <DiscountProductsGrid products={products} />
      </section>
    </main>
  );
}
