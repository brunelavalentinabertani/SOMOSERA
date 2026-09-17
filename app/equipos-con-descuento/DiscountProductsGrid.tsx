"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { ProductTile, type Settings } from "../products/ProductsClient";
import ProductSort from "../../components/product/ProductSort";
import { sortProductsByPrice, type ProductSortOrder } from "../../lib/productSort";

export default function DiscountProductsGrid({ products }: { products: Product[] }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [sortOrder, setSortOrder] = useState<ProductSortOrder>("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) return;

        const data = (await response.json()) as Settings;
        if (active) setSettings(data);
      } catch {
        if (active) setSettings(null);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <ProductSort value={sortOrder} onChange={setSortOrder} />
      </div>
    <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
      {sortProductsByPrice(products, sortOrder).map((product) => (
        <ProductTile key={product.id} product={product} settings={settings} />
      ))}
    </div>
    </>
  );
}
