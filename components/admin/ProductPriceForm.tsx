"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  title: string;
  subtitle?: string;
  initialPrice: number | null;
  initialUsdRate?: number | null;
  showUsdRate?: boolean;
  onSave: (price: number, usdRate?: number) => Promise<void>;
};

export default function ProductPriceForm({
  title,
  subtitle,
  initialPrice,
  initialUsdRate,
  showUsdRate = false,
  onSave,
}: Props) {
  const router = useRouter();

  const [price, setPrice] = useState<number>(initialPrice ?? 0);
  const [usdRate, setUsdRate] = useState<number>(initialUsdRate ?? 0);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onSave(price, usdRate);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 my-6">
      <h1 className="text-xl font-bold">{title}</h1>

      <div className="border rounded p-4 space-y-4">
        <div>
          <p className="font-medium">{title}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">
            Precio en USD
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        {showUsdRate && (
          <div>
            <label className="block text-sm mb-1">
              Valor del dólar
            </label>
            <input
              type="number"
              step="0.01"
              value={usdRate}
              onChange={(e) => setUsdRate(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full "
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>

      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 "
      >
        Volver
      </button>
    </div>
  );
}
