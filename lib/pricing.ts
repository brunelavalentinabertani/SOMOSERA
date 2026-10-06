export type PricingMultipliers = {
    transferMultiplier?: number; // default 1.05
    listMultiplier?: number;     // default 1.55
};

const INSTALLMENT_TRANSFER_MULTIPLIER = 1.05;

export const INSTALLMENT_OPTIONS = [
    { count: 3, financingMultiplier: 1.19 },
    { count: 6, financingMultiplier: 1.26 },
    { count: 9, financingMultiplier: 1.36 },
    { count: 12, financingMultiplier: 1.46 },
] as const;

export type InstallmentCount = (typeof INSTALLMENT_OPTIONS)[number]["count"];

export function calculateInstallmentAmount(
    priceUsd: number,
    usdRate: number,
    count: InstallmentCount,
) {
    const option = INSTALLMENT_OPTIONS.find((item) => item.count === count);

    if (!option) return 0;

    return priceUsd * usdRate * INSTALLMENT_TRANSFER_MULTIPLIER * option.financingMultiplier / count;
}

export function calculatePrices(
    priceUsd: number,
    usdRate: number,
    multipliers?: { transferMultiplier?: number; listMultiplier?: number }
) {
    const base = priceUsd * usdRate;
    const transferPrice = base * (multipliers?.transferMultiplier ?? 1.05);
    const listPrice = transferPrice * (multipliers?.listMultiplier ?? 1.55);

    return {
        transferPrice,
        listPrice,
        installments: INSTALLMENT_OPTIONS.map(({ count }) => ({
            count,
            amount: calculateInstallmentAmount(priceUsd, usdRate, count),
        })),
    };
}
