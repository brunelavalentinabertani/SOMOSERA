export type PricingMultipliers = {
    transferMultiplier?: number; // default 1.05
    listMultiplier?: number;     // default 1.55
};

const INSTALLMENT_TRANSFER_MULTIPLIER = 1.05;
const INSTALLMENT_FINANCING_MULTIPLIER = 1.59;

export function calculatePrices(
    priceUsd: number,
    usdRate: number,
    multipliers?: { transferMultiplier?: number; listMultiplier?: number }
) {
    const base = priceUsd * usdRate;
    const transferPrice = base * (multipliers?.transferMultiplier ?? 1.05);
    const listPrice = transferPrice * (multipliers?.listMultiplier ?? 1.55);
    const installmentTotal = base * INSTALLMENT_TRANSFER_MULTIPLIER * INSTALLMENT_FINANCING_MULTIPLIER;

    return {
        transferPrice,
        listPrice,
        installment6: installmentTotal / 6,
        installment12: installmentTotal / 12,
    };
}
