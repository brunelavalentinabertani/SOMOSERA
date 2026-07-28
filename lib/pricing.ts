export type PricingMultipliers = {
    transferMultiplier?: number; // default 1.05
    listMultiplier?: number;     // default 1.55
};
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
        installment6: transferPrice / 6,
        installment12: transferPrice / 12,
    };
}
