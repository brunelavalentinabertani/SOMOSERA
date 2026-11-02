"use client";

import { useState } from "react";
import { formatPrice } from "../../lib/formatPrices";
import type { calculatePrices, InstallmentCount } from "../../lib/pricing";
import { useCurrencyPreference } from "../pricing/CurrencyPreference";
import InstallmentSelect from "./InstallmentSelect";

type CalculatedPrices = ReturnType<typeof calculatePrices>;

export default function ProductPrice({
    priceUsd,
    prices,
    variant = "card",
}: {
    priceUsd: number;
    prices: CalculatedPrices;
    variant?: "card" | "detail";
}) {
    const { currency } = useCurrencyPreference();
    const [showLocalUsd, setShowLocalUsd] = useState(false);
    const [selectedCount, setSelectedCount] = useState<InstallmentCount>(12);
    const showUsd = currency === "USD" || showLocalUsd;
    const selectedPlan =
        prices.installments.find((installment) => installment.count === selectedCount) ??
        prices.installments[prices.installments.length - 1];
    const financedPrice = Math.round(selectedPlan.amount) * selectedPlan.count;
    const isDetail = variant === "detail";

    if (showUsd) {
        return (
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className={`${isDetail ? "text-[13px]" : "text-[11px]"} font-bold uppercase tracking-[0.08em] text-era-text-muted`}>
                        Precio abonando en USD
                    </p>
                    <p className={`${isDetail ? "mt-1 text-[34px] sm:text-[38px]" : "mt-1 text-[20px]"} font-black leading-none text-era-success`}>
                        USD {formatPrice(priceUsd)}
                    </p>
                </div>

                {currency === "ARS" && (
                    <button
                        type="button"
                        onClick={() => setShowLocalUsd(false)}
                        className="cursor-pointer rounded-[5px] border border-era-line bg-white px-3 py-2 text-left text-[11px] font-bold leading-tight text-era-black transition hover:border-era-blue hover:text-era-blue"
                    >
                        Ver precio financiado en ARS
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={isDetail ? "space-y-4" : "space-y-3"}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className={`${isDetail ? "text-[13px]" : "text-[11px]"} font-bold uppercase tracking-[0.08em] text-era-text-muted`}>
                        Precio financiado
                    </p>
                    <p aria-live="polite" className={`${isDetail ? "mt-1 text-[32px] sm:text-[36px]" : "mt-1 text-[20px]"} font-black leading-none text-era-black`}>
                        ${formatPrice(financedPrice)}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowLocalUsd(true)}
                    className={`${isDetail ? "max-w-[220px] px-4 py-3 text-[12px]" : "max-w-[170px] px-3 py-2 text-[11px]"} cursor-pointer rounded-[5px] border border-era-success bg-[#f4fff8] text-left font-bold leading-tight text-era-black transition hover:bg-era-success hover:text-white`}
                >
                    Obtené un mejor precio abonando en USD
                </button>
            </div>

            <InstallmentSelect
                installments={prices.installments}
                selectedCount={selectedCount}
                onSelectedCountChange={setSelectedCount}
                containerClassName={isDetail ? "max-w-[320px]" : "max-w-full"}
                className={isDetail ? "text-[14px]" : "text-[12px]"}
            />

            <p className={`${isDetail ? "text-[16px]" : "text-[13px]"} font-bold text-era-success`}>
                Transferencia bancaria: ${formatPrice(prices.transferPrice)}
            </p>
        </div>
    );
}
