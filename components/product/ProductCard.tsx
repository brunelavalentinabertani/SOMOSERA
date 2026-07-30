"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product, ProductColor } from "@/types/product";
import { calculatePrices } from "../../lib/pricing";
import { formatPrice } from "../../lib/formatPrices";

function getDefaultProductOptions(product: Product) {
    const hasVariantColors = product.product_variants.some((variant) => !!variant.color_name);
    const defaultVariant =
        (hasVariantColors
            ? product.product_variants.find((variant) => !!variant.color_name)
            : product.product_variants[0]) ?? null;

    const defaultColor: ProductColor | null = (() => {
        if (hasVariantColors) {
            if (!defaultVariant?.color_name) return null;

            const fromTable = product.products_colors?.find(
                (color) => color.name === defaultVariant.color_name,
            );

            if (fromTable) return fromTable;

            return {
                id: defaultVariant.color_name,
                name: defaultVariant.color_name,
                hex: defaultVariant.color_hex,
                image_url: defaultVariant.image_url ?? null,
            };
        }

        return product.products_colors?.[0] ?? null;
    })();

    return { defaultVariant, defaultColor };
}

export function ProductCard({
    product,
    usdRate,
    multipliers,
}: {
    product: Product;
    usdRate: number;
    multipliers: { transferMultiplier: number; listMultiplier: number };
}) {
    const hasVariantColors = product.product_variants.some((variant) => !!variant.color_name);
    const { defaultVariant, defaultColor } = getDefaultProductOptions(product);

    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(() => defaultColor);
    const [selectedStorage, setSelectedStorage] = useState<number | null>(
        () => defaultVariant?.storage_gb ?? null,
    );
    const [selectedRam, setSelectedRam] = useState<number | null>(
        () => defaultVariant?.ram_gb ?? null,
    );
    const [selectedScreen, setSelectedScreen] = useState<number | null>(
        () => defaultVariant?.screen_inches ?? null,
    );

    const hasVariants = product.product_variants.length > 0;

    const activeVariant = hasVariants
        ? product.product_variants.find((variant) => {
            return (
                variant.storage_gb === selectedStorage &&
                variant.ram_gb === selectedRam &&
                variant.screen_inches === selectedScreen &&
                (hasVariantColors ? variant.color_name === selectedColor?.name : true)
            );
        }) ?? null
        : null;

    const variantColors: ProductColor[] = Array.from(
        new Map(
            product.product_variants
                .filter((variant) => variant.color_name)
                .map((variant) => [
                    variant.color_name,
                    {
                        id: variant.color_name,
                        name: variant.color_name,
                        hex: variant.color_hex,
                        image_url: variant.image_url ?? null,
                    },
                ]),
        ).values(),
    );

    const colors = variantColors.length > 0 ? variantColors : product.products_colors ?? [];
    const storages = Array.from(new Set(product.product_variants.map((variant) => variant.storage_gb)));
    const rams = Array.from(
        new Set(product.product_variants.map((variant) => variant.ram_gb).filter(Boolean)),
    );
    const screens = Array.from(
        new Set(product.product_variants.map((variant) => variant.screen_inches).filter(Boolean)),
    );

    const basePriceUsd = hasVariants
        ? activeVariant?.price_usd ?? null
        : product.price_usd ?? null;

    const isAvailable = hasVariants ? !!activeVariant : true;
    const prices =
        basePriceUsd && usdRate > 0
            ? calculatePrices(basePriceUsd, usdRate, multipliers)
            : null;

    const imageSrc =
        activeVariant?.image_url ??
        selectedColor?.image_url ??
        product.image_url ??
        null;

    return (
        <div className="bg-white border rounded-2xl p-3 md:p-6 flex flex-col hover:shadow-lg transition h-full">
            <div className="relative w-full aspect-square">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-contain"
                    />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        Sin imagen
                    </div>
                )}
            </div>

            <div className="mt-4 flex flex-col flex-1 select-text">
                <h3 className="text-sm md:text-lg font-semibold text-gray-900">
                    {product.name}
                </h3>

                {colors.length > 0 && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                        {colors.map((color) => {
                            const isActive = selectedColor?.name === color.name;

                            return (
                                <button
                                    key={color.name}
                                    type="button"
                                    aria-label={`Elegir color ${color.name}`}
                                    onClick={() => setSelectedColor(color)}
                                    className="w-9 h-9 rounded-full transition"
                                    style={{
                                        backgroundColor: color.hex,
                                        outline: isActive ? "2px solid #0071e3" : "2px solid transparent",
                                        outlineOffset: "2px",
                                    }}
                                />
                            );
                        })}
                    </div>
                )}

                {hasVariants && (
                    <div className="mt-1">
                        <p className="text-sm mb-2 font-medium">Almacenamiento</p>
                        {storages.map((storage) => {
                            const isActive = selectedStorage === storage;

                            return (
                                <button
                                    key={storage}
                                    type="button"
                                    onClick={() => setSelectedStorage(storage)}
                                    className={`px-3 py-1 text-xs md:text-sm rounded-full border transition ${isActive
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                                        }`}
                                >
                                    {storage} GB
                                </button>
                            );
                        })}
                    </div>
                )}

                {rams.length > 0 && (
                    <div className="mb-1">
                        <p className="text-sm mb-2 font-medium">Memoria RAM</p>
                        <div className="flex gap-3">
                            {rams.map((ram) => (
                                <button
                                    key={ram}
                                    type="button"
                                    onClick={() => setSelectedRam(ram as number)}
                                    className={` px-3 py-1 rounded-full border transition ${selectedRam === ram
                                        ? "bg-black text-white border-black"
                                        : "border-gray-300 hover:border-gray-500"
                                        }`}
                                >
                                    {ram} GB
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {screens.length > 0 && (
                    <div className="mb-1">
                        <p className="text-sm mb-2 font-medium">TamaÃ±o</p>
                        <div className="flex gap-3">
                            {screens.map((screen) => (
                                <button
                                    key={screen}
                                    type="button"
                                    onClick={() => setSelectedScreen(screen as number)}
                                    className={` px-3 py-1 rounded-full border transition ${selectedScreen === screen
                                        ? "bg-black text-white border-black"
                                        : "border-gray-300 hover:border-gray-500"
                                        }`}
                                >
                                    {screen}&quot;
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {hasVariants && !activeVariant ? (
                    <p className="mt-4 text-lg md:text-xl font-bold text-red-500">
                        No disponible
                    </p>
                ) : (
                    prices ? (
                        <div className="mt-4 space-y-1">
                            <p className="text-xs text-gray-600 font-medium">
                                6 cuotas fijas de: ${formatPrice(prices.installment6)}
                            </p>
                            <p className="text-lg md:text-xl font-bold text-orange-500">
                                ${formatPrice(prices.transferPrice)} en Transferencia
                            </p>
                            <p className="text-lg md:text-xl font-bold text-500">
                                ${basePriceUsd} en un pago en USD
                            </p>
                        </div>
                    ) : (
                        <p className="mt-4 text-lg md:text-xl font-bold text-gray-900">
                            CONSULTAR
                        </p>
                    )
                )}
            </div>

            {isAvailable ? (
                <Link href={`/products/${product.id}`} className="mt-4">
                    <button className=" w-full rounded-xl bg-black text-white py-2 md:py-3 text-sm md:text-base hover:bg-gray-800 transition">
                        Ver mÃ¡s
                    </button>
                </Link>
            ) : (
                <button
                    disabled
                    className="mt-4 w-full rounded-xl bg-gray-300 text-gray-500 py-2 md:py-3 text-sm md:text-base"
                >
                    No disponible
                </button>
            )}
        </div>
    );
}
