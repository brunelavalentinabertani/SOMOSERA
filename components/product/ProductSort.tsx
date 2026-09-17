"use client";

import type { ProductSortOrder } from "../../lib/productSort";

export default function ProductSort({ value, onChange }: {
  value: ProductSortOrder;
  onChange: (value: ProductSortOrder) => void;
}) {
  return (
    <label className="flex w-full flex-col gap-2 text-[14px] font-semibold sm:w-auto sm:flex-row sm:items-center sm:gap-3">
      <span>Ordenar</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as ProductSortOrder)}
        className="min-h-11 w-full cursor-pointer rounded-[4px] border border-era-line bg-white px-3 py-2 text-[13px] text-era-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-era-orange sm:w-auto"
      >
        <option value="">Ordenar</option>
        <option value="price-asc">Más barato a más caro</option>
        <option value="price-desc">Más caro a más barato</option>
      </select>
    </label>
  );
}
