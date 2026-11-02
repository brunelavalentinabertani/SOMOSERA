"use client";

import { useState } from "react";
import { formatPrice } from "../../lib/formatPrices";
import type { calculatePrices, InstallmentCount } from "../../lib/pricing";
import { type Currency, useCurrencyPreference } from "../pricing/CurrencyPreference";
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
    const { currency, currencyRevision } = useCurrencyPreference();
    const [localCurrency, setLocalCurrency] = useState<{
        currency: Currency;
        globalRevision: number;
    } | null>(null);
    const [selectedCount, setSelectedCount] = useState<InstallmentCount>(12);
    const isDetail = variant === "detail";
    const displayCurrency =
        isDetail && localCurrency?.globalRevision === currencyRevision
            ? localCurrency.currency
            : currency;
    const selectedPlan =
        prices.installments.find((installment) => installment.count === selectedCount) ??
        prices.installments[prices.installments.length - 1];
    const financedPrice = Math.round(selectedPlan.amount) * selectedPlan.count;

    if (displayCurrency === "USD") {
        return (
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className={`${isDetail ? "text-[13px]" : "text-[11px]"} font-bold uppercase tracking-[0.08em] text-era-text-muted`}>
                        Precio abonando en USD
                    </p>
                    <p className={`${isDetail ? "mt-1 text-[34px] sm:text-[38px]" : "mt-1 text-[20px]"} font-black leading-none text-era-orange`}>
                        USD {formatPrice(priceUsd)}
                    </p>
                </div>

                {isDetail && (
                    <button
                        type="button"
                        onClick={() => setLocalCurrency({ currency: "ARS", globalRevision: currencyRevision })}
                        className="cursor-pointer rounded-[5px] border border-era-orange bg-[#fff6f1] px-4 py-3 text-left text-[12px] font-bold leading-tight text-era-black transition hover:bg-era-orange hover:text-white"
                    >
                        Ver precio en ARS
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={isDetail ? "space-y-4" : "space-y-3"}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p aria-live="polite" className={`${isDetail ? "text-[32px] sm:text-[36px]" : "text-[20px]"} font-black leading-none text-era-black`}>
                        ${formatPrice(financedPrice)}
                    </p>
                </div>

                {isDetail && (
                    <button
                        type="button"
                        onClick={() => setLocalCurrency({ currency: "USD", globalRevision: currencyRevision })}
                        className="max-w-[220px] cursor-pointer rounded-[5px] border border-era-orange bg-[#fff6f1] px-4 py-3 text-left text-[12px] font-bold leading-tight text-era-black transition hover:bg-era-orange hover:text-white"
                    >
                        Obtené un mejor precio abonando en USD
                    </button>
                )}
            </div>

            <InstallmentSelect
                installments={prices.installments}
                selectedCount={selectedCount}
                onSelectedCountChange={setSelectedCount}
                containerClassName={isDetail ? "max-w-[320px]" : "max-w-full"}
                className={isDetail ? "text-[14px]" : "text-[12px]"}
            />

            <p className={`${isDetail ? "text-[16px]" : "text-[13px]"} font-bold text-era-orange`}>
                Transferencia bancaria: ${formatPrice(prices.transferPrice)}
            </p>
        </div>
    );
}
