"use client";

import { useState } from "react";
import { formatPrice } from "../../lib/formatPrices";
import type { InstallmentCount } from "../../lib/pricing";

type Installment = {
    count: InstallmentCount;
    amount: number;
};

export default function InstallmentSelect({
    installments,
    className = "",
}: {
    installments: Installment[];
    className?: string;
}) {
    const [selectedCount, setSelectedCount] = useState<InstallmentCount>(12);

    return (
        <select
            aria-label="Elegir cantidad de cuotas"
            value={selectedCount}
            onChange={(event) => setSelectedCount(Number(event.target.value) as InstallmentCount)}
            className={`cursor-pointer rounded-[4px] border border-era-line bg-white px-2 py-1 font-semibold text-era-black outline-none focus:border-era-blue ${className}`}
        >
            {installments.map(({ count, amount }) => (
                <option key={count} value={count}>
                    {count} cuotas de: ${formatPrice(amount)}
                </option>
            ))}
        </select>
    );
}
