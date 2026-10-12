"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { ProductTile, type Settings } from "../products/ProductsClient";
import ProductSort from "../../components/product/ProductSort";
import { sortProductsByPrice, type ProductSortOrder } from "../../lib/productSort";
import { getMotherDayProductGroup, type MotherDayProductGroup } from "../../lib/motherDayProducts";

const PRODUCTS_PER_PAGE = 12;
const groups: Array<"Todos" | MotherDayProductGroup> = [
  "Todos",
  "Apple Watch",
  "iPad",
  "Celulares",
  "AirPods",
];

export default function MotherDayProductsGrid({ products }: { products: Product[] }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [sortOrder, setSortOrder] = useState<ProductSortOrder>("");
  const [activeGroup, setActiveGroup] = useState<(typeof groups)[number]>("Todos");
  const [currentPage, setCurrentPage] = useState(1);

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

  const groupCounts = useMemo(() => {
    const counts = new Map<MotherDayProductGroup, number>();
    products.forEach((product) => {
      const group = getMotherDayProductGroup(product);
      if (group) counts.set(group, (counts.get(group) ?? 0) + 1);
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(
    () => activeGroup === "Todos"
      ? products
      : products.filter((product) => getMotherDayProductGroup(product) === activeGroup),
    [activeGroup, products],
  );
  const sortedProducts = useMemo(
    () => sortProductsByPrice(filteredProducts, sortOrder),
    [filteredProducts, sortOrder],
  );
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = sortedProducts.slice(
    (safePage - 1) * PRODUCTS_PER_PAGE,
    safePage * PRODUCTS_PER_PAGE,
  );

  function selectGroup(group: (typeof groups)[number]) {
    setActiveGroup(group);
    setCurrentPage(1);
  }

  return (
    <>
      <div className="mb-7 flex flex-col gap-5 border-b border-era-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[24px] font-black">Regalos seleccionados</h2>
          <p className="mt-1 text-[13px] font-semibold text-era-text-muted">
            {filteredProducts.length} productos
          </p>
        </div>
        <ProductSort value={sortOrder} onChange={(value) => {
          setSortOrder(value);
          setCurrentPage(1);
        }} />
      </div>

      <div className="mb-7 flex gap-2 overflow-x-auto pb-2" aria-label="Filtrar productos por tipo">
        {groups.map((group) => {
          const count = group === "Todos" ? products.length : (groupCounts.get(group) ?? 0);
          return (
            <button
              key={group}
              type="button"
              aria-pressed={activeGroup === group}
              onClick={() => selectGroup(group)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[12px] font-bold transition ${
                activeGroup === group
                  ? "border-era-black bg-era-black text-white"
                  : "border-era-line bg-white text-era-black hover:border-era-black"
              }`}
            >
              {group} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
        {paginatedProducts.map((product) => (
          <ProductTile key={product.id} product={product} settings={settings} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-9 flex flex-wrap justify-center gap-2" aria-label="Páginas de productos">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              aria-label={`Ir a la página ${page}`}
              aria-current={page === safePage ? "page" : undefined}
              onClick={() => setCurrentPage(page)}
              className={`h-9 w-9 cursor-pointer rounded-[4px] border text-[13px] font-bold ${
                page === safePage
                  ? "border-era-black bg-era-black text-white"
                  : "border-era-line bg-era-white text-era-black"
              }`}
            >
              {page}
            </button>
          ))}
        </nav>
      )}
    </>
  );
}
