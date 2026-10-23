"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatPrice } from "../../lib/formatPrices";
import type { InstallmentCount } from "../../lib/pricing";

type Installment = {
    count: InstallmentCount;
    amount: number;
};

export default function InstallmentSelect({
    installments,
    className = "",
    containerClassName = "",
}: {
    installments: Installment[];
    className?: string;
    containerClassName?: string;
}) {
    const [selectedCount, setSelectedCount] = useState<InstallmentCount>(12);

    return (
        <div className={`relative w-full ${containerClassName}`}>
            <select
                aria-label="Elegir cantidad de cuotas"
                value={selectedCount}
                onChange={(event) => setSelectedCount(Number(event.target.value) as InstallmentCount)}
                className={`h-11 w-full cursor-pointer appearance-none rounded-[4px] border border-era-line bg-white px-4 pr-11 font-bold text-era-black shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-colors hover:border-era-black focus:border-era-blue focus:ring-2 focus:ring-era-blue/15 ${className}`}
            >
                {installments.map(({ count, amount }) => (
                    <option key={count} value={count}>
                        {count} cuotas de: ${formatPrice(amount)}
                    </option>
                ))}
            </select>
            <ChevronDown
                aria-hidden="true"
                size={18}
                strokeWidth={2}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-era-black"
            />
        </div>
    );
}
