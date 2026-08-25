"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { ProductTile, type Settings } from "../products/ProductsClient";

export default function DiscountProductsGrid({ products }: { products: Product[] }) {
  const [settings, setSettings] = useState<Settings | null>(null);

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
    <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
      {products.map((product) => (
        <ProductTile key={product.id} product={product} settings={settings} />
      ))}
    </div>
  );
}
