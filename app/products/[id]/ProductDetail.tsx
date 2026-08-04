"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    Box,
    CreditCard,
    MessageCircle,
    ShieldCheck,
    ShoppingBag,
    Store,
    Truck,
} from "lucide-react";
import { Product, ProductColor } from "@/types/product";
import EraHeader from "../../../components/layout/EraHeader";
import { calculatePrices } from "../../../lib/pricing";
import { formatPrice } from "../../../lib/formatPrices";

type Settings = {
    usd_rate: number;
    transfer_multiplier: number;
    list_multiplier: number;
};

const detailBenefits = [
    { title: "Garantía Apple Oficial", text: "", Icon: ShieldCheck },
    { title: "Retiro en Palermo", text: "Retirá gratis en nuestra tienda", Icon: Store },
    { title: "Envíos a todo el país", text: "Rápido y seguro por Correo Andreani", Icon: Truck },
    { title: "Pagá tranquilo", text: "Transferencia, tarjetas y más", Icon: CreditCard },
];

const faqs = [
    {
        question: "¿Los productos son originales?",
        answer: "Todos nuestros equipos son originales y sellados.",
    },
    {
        question: "¿Hacen envíos a todo el país?",
        answer: "Sí, hacemos envíos mediante Correo Andreani a todo el país.",
    },
    {
        question: "¿Tienen garantía?",
        answer: "Todos los equipos Apple tienen garantía oficial por 12 meses. Los demás equipos tienen garantía de 3 meses con nosotros mismos.",
    },
    {
        question: "¿Cómo puedo pagar?",
        answer: "Nuestros métodos de pago son USD o ARS. También podés abonar en 6 cuotas fijas.",
    },
];

function formatStorage(storage: number) {
    return storage >= 1024 ? `${storage / 1024} TB` : `${storage} GB`;
}

function formatVariantOption(variant: Product["product_variants"][number]) {
    const details = [];
    const chip = getVariantChip(variant);

    if (chip) details.push(`chip ${chip}`);
    if (typeof variant.screen_inches === "number") details.push(`${variant.screen_inches}\"`);
    if (typeof variant.ram_gb === "number") details.push(`${variant.ram_gb} GB RAM`);
    if (typeof variant.storage_gb === "number") details.push(formatStorage(variant.storage_gb));

    return details.join(", ");
}

function getVariantChip(variant: Product["product_variants"][number]) {
    const name = variant.color_name?.trim();
    return name?.toLowerCase().startsWith("chip ") ? name.slice(5) : null;
}

function getVariantKey(variant: Product["product_variants"][number]) {
    return [getVariantChip(variant) ?? "", variant.storage_gb ?? "", variant.ram_gb ?? "", variant.screen_inches ?? ""].join("-");
}

function matchesVariantKey(variant: Product["product_variants"][number], key: string | null) {
    return key === null || getVariantKey(variant) === key;
}

function sortVariants(variants: Product["product_variants"]) {
    const chipOrder = ["M4", "M4 Pro", "M4 Max", "M5", "M5 Pro", "M5 Max"];

    return [...variants].sort((a, b) => {
        const chipDiff = chipOrder.indexOf(getVariantChip(a) ?? "") - chipOrder.indexOf(getVariantChip(b) ?? "");
        if (chipDiff !== 0) return chipDiff;
        const screenDiff = (a.screen_inches ?? 0) - (b.screen_inches ?? 0);
        if (screenDiff !== 0) return screenDiff;
        const storageDiff = (a.storage_gb ?? 0) - (b.storage_gb ?? 0);
        if (storageDiff !== 0) return storageDiff;
        return (a.ram_gb ?? 0) - (b.ram_gb ?? 0);
    });
}

function getUniqueVariantOptions(variants: Product["product_variants"]) {
    return Array.from(
        new Map(sortVariants(variants).map((variant) => [getVariantKey(variant), variant])).values(),
    );
}

function isSelectableColor(name: string | null | undefined) {
    if (!name?.trim()) return false;
    if (name.trim().toLowerCase().startsWith("chip ")) return false;

    const normalizedName = name
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim()
        .toLowerCase();

    return !["natural", "default", "sin color", "consultar"].includes(normalizedName);
}

function getProductColors(product: Product): ProductColor[] {
    const colors = new Map<string, ProductColor>();

    product.products_colors?.forEach((color) => {
        if (isSelectableColor(color.name)) colors.set(color.name, color);
    });
    product.product_variants?.forEach((variant) => {
        if (!isSelectableColor(variant.color_name)) return;

        colors.set(variant.color_name, {
            id: variant.color_name,
            name: variant.color_name,
            hex: variant.color_hex || colors.get(variant.color_name)?.hex || "#d8d8d8",
            image_url: variant.image_url ?? colors.get(variant.color_name)?.image_url ?? null,
        });
    });

    return Array.from(colors.values());
}

function getCardImage(product: Product) {
    const variantImage = product.product_variants?.find((variant) => variant.image_url)?.image_url;
    const colorImage = product.products_colors?.find((color) => color.image_url)?.image_url;

    return variantImage ?? colorImage ?? product.image_url ?? null;
}

function RelatedCard({ product }: { product: Product }) {
    const variant = product.product_variants?.[0] ?? null;
    const image = getCardImage(product);
    const price = variant?.price_usd ?? product.price_usd;

    return (
        <article className="relative rounded-[8px] border border-era-line bg-white p-5">
            <Link href={`/products/${product.id}`} className="block">
                <div className="relative h-[190px]">
                    {image ? (
                        <Image src={image} alt={product.name} fill className="object-contain" sizes="16vw" />
                    ) : (
                        <span className="flex h-full items-center justify-center text-center text-[13px] font-semibold text-era-text-muted">
                            Imagen no disponible
                        </span>
                    )}
                </div>
                <h3 className="mt-4 text-[14px] font-semibold">{product.name}</h3>
                <p className="mt-2 text-[16px] font-black">
                    {price ? `USD ${price}` : "CONSULTAR"}
                </p>
                <p className="text-[12px] text-era-text-muted">6 cuotas fijas</p>
            </Link>
        </article>
    );
}

export default function ProductDetail({
    product,
    relatedProducts,
}: {
    product: Product;
    relatedProducts: Product[];
}) {
    const [settings, setSettings] = useState<Settings | null>(null);
    const variants = useMemo(() => sortVariants(product.product_variants ?? []), [product.product_variants]);
    const variantOptions = useMemo(() => getUniqueVariantOptions(product.product_variants ?? []), [product.product_variants]);
    const chipOptions = useMemo(
        () => Array.from(new Set(variants.map(getVariantChip).filter((chip): chip is string => Boolean(chip)))),
        [variants],
    );
    const screenOptions = useMemo(
        () => Array.from(new Set(variants.map((variant) => variant.screen_inches).filter((screen): screen is number => typeof screen === "number"))),
        [variants],
    );
    const defaultVariant = variants[0] ?? null;
    const colors = useMemo(() => getProductColors(product), [product]);
    const [selectedVariantKey, setSelectedVariantKey] = useState<string | null>(
        () => (variantOptions[0] ? getVariantKey(variantOptions[0]) : null),
    );
    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(colors[0] ?? null);
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function loadSettings() {
            try {
                const response = await fetch("/api/settings");
                if (!response.ok) return;

                const data = (await response.json()) as Settings;
                if (active) setSettings(data);
            } catch {
                if (active) setSettings(null);
            }
        }

        loadSettings();

        return () => {
            active = false;
        };
    }, []);

    const activeVariant =
        (selectedColor?.name
            ? variants.find(
                (variant) => matchesVariantKey(variant, selectedVariantKey) && variant.color_name === selectedColor.name,
            )
            : null) ??
        variants.find((variant) => matchesVariantKey(variant, selectedVariantKey)) ??
        defaultVariant;
    const selectedChip = activeVariant ? getVariantChip(activeVariant) : chipOptions[0] ?? null;
    const selectedScreen = activeVariant?.screen_inches ?? screenOptions[0] ?? null;
    const selectedRam = activeVariant?.ram_gb ?? null;
    const variantsForSelection = variantOptions.filter((variant) =>
        (!selectedChip || getVariantChip(variant) === selectedChip) &&
        (selectedScreen === null || variant.screen_inches === selectedScreen) &&
        (selectedRam === null || variant.ram_gb === selectedRam),
    );
    const visibleScreenOptions = Array.from(new Set(
        variants
            .filter((variant) => !selectedChip || getVariantChip(variant) === selectedChip)
            .map((variant) => variant.screen_inches)
            .filter((screen): screen is number => typeof screen === "number"),
    ));
    const visibleRamOptions = Array.from(new Set(
        variants
            .filter((variant) =>
                (!selectedChip || getVariantChip(variant) === selectedChip) &&
                (selectedScreen === null || variant.screen_inches === selectedScreen),
            )
            .map((variant) => variant.ram_gb)
            .filter((ram): ram is number => typeof ram === "number"),
    ));

    const selectChip = (chip: string) => {
        const nextVariant =
            variants.find((variant) =>
                getVariantChip(variant) === chip &&
                variant.screen_inches === selectedScreen &&
                variant.ram_gb === selectedRam &&
                variant.storage_gb === activeVariant?.storage_gb,
            ) ?? variants.find((variant) => getVariantChip(variant) === chip);

        if (nextVariant) setSelectedVariantKey(getVariantKey(nextVariant));
    };

    const selectScreen = (screen: number) => {
        const nextVariant =
            variants.find((variant) =>
                (!selectedChip || getVariantChip(variant) === selectedChip) &&
                variant.screen_inches === screen &&
                variant.ram_gb === selectedRam &&
                variant.storage_gb === activeVariant?.storage_gb,
            ) ?? variants.find((variant) =>
                (!selectedChip || getVariantChip(variant) === selectedChip) && variant.screen_inches === screen,
            );

        if (nextVariant) setSelectedVariantKey(getVariantKey(nextVariant));
    };

    const selectRam = (ram: number) => {
        const nextVariant = variants.find((variant) =>
            (!selectedChip || getVariantChip(variant) === selectedChip) &&
            (selectedScreen === null || variant.screen_inches === selectedScreen) &&
            variant.ram_gb === ram &&
            variant.storage_gb === activeVariant?.storage_gb,
        );

        if (nextVariant) setSelectedVariantKey(getVariantKey(nextVariant));
    };

    const mainImage =
        activeVariant?.image_url ??
        selectedColor?.image_url ??
        product.image_url ??
        null;

    const basePriceUsd = activeVariant ? activeVariant.price_usd : product.price_usd ?? null;
    const shouldConsult = basePriceUsd === null || basePriceUsd <= 0;
    const prices = !shouldConsult && settings?.usd_rate
        ? calculatePrices(basePriceUsd, settings.usd_rate, {
            transferMultiplier: settings.transfer_multiplier,
            listMultiplier: settings.list_multiplier,
        })
        : null;

    const handleBuy = () => {
        let message = `Hola! Quiero consultar por ${product.name}`;
        if (activeVariant) message += `, ${formatVariantOption(activeVariant)}`;
        if (selectedColor) message += `, color ${selectedColor.name}`;
        message += `. ¿Está disponible?`;

        window.open(`https://wa.me/5491171254322?text=${encodeURIComponent(message)}`, "_blank");
    };

    return (
        <main className="min-h-screen bg-era-white text-era-black">
            <EraHeader />

            <section className="border-t border-era-line">
                <div className="mx-auto max-w-[1420px] px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
                    <p className="text-[13px] text-era-text-muted">
                        Inicio <span className="mx-3">/</span> {product.category} <span className="mx-3">/</span> {product.name}
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-8 xl:grid-cols-[minmax(0,760px)_1fr] xl:gap-14">
                        <div className="relative flex min-h-[360px] items-center justify-center rounded-[8px] bg-white sm:min-h-[520px] xl:min-h-[700px]">
                            {mainImage ? (
                                <Image src={mainImage} alt={product.name} fill className="object-contain p-6 sm:p-10 xl:p-14" sizes="(max-width: 1279px) 100vw, 55vw" priority />
                            ) : (
                                <span className="px-6 text-center text-[15px] font-semibold text-era-text-muted">
                                    Imagen no disponible
                                </span>
                            )}
                        </div>

                        <aside className="pt-2">
                            <p className="text-[14px] font-bold">{product.brand}</p>
                            <h1 className="mt-4 text-[32px] font-black leading-tight tracking-[-0.04em] sm:text-[38px] xl:text-[42px]">
                                {product.name}
                            </h1>
                            <p className="mt-4 text-[14px] text-era-text-muted">
                                Nuevo <span className="mx-3">•</span> Sellado <span className="mx-3">•</span> Original
                            </p>

                            <div className="mt-8 border-b border-era-line pb-7">
                                {shouldConsult ? (
                                    <p className="text-[36px] font-black">CONSULTAR</p>
                                ) : prices ? (
                                    <div className="space-y-2">
                                        <p className="text-[14px] font-semibold">
                                            6 cuotas fijas de: ${formatPrice(prices.installment6)}
                                        </p>
                                        <p className="text-[28px] font-black leading-tight text-era-orange sm:text-[34px] xl:text-[36px]">
                                            ${formatPrice(prices.transferPrice)} en Transferencia
                                        </p>
                                        <p className="text-[16px] font-bold text-era-black">
                                            USD {basePriceUsd} en un pago
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-[36px] font-black">USD {basePriceUsd}</p>
                                )}
                            </div>

                            {chipOptions.length > 1 && (
                                <div className="mt-7">
                                    <p className="text-[13px] font-bold">Chip</p>
                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {chipOptions.map((chip) => (
                                            <button
                                                key={chip}
                                                type="button"
                                                onClick={() => selectChip(chip)}
                                                className={`h-11 rounded-[5px] border text-[13px] font-semibold ${selectedChip === chip
                                                    ? "border-era-blue bg-white text-era-black"
                                                    : "border-era-line bg-era-white text-era-black"
                                                    }`}
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {visibleScreenOptions.length > 1 && (
                                <div className="mt-7">
                                    <p className="text-[13px] font-bold">Pulgadas</p>
                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {visibleScreenOptions.map((screen) => (
                                            <button
                                                key={screen}
                                                type="button"
                                                onClick={() => selectScreen(screen)}
                                                className={`h-11 rounded-[5px] border text-[13px] font-semibold ${selectedScreen === screen
                                                    ? "border-era-blue bg-white text-era-black"
                                                    : "border-era-line bg-era-white text-era-black"
                                                    }`}
                                            >
                                                {screen}&quot;
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {visibleRamOptions.length > 0 && (
                                <div className="mt-7">
                                    <p className="text-[13px] font-bold">Memoria RAM</p>
                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {visibleRamOptions.map((ram) => (
                                            <button
                                                key={ram}
                                                type="button"
                                                onClick={() => selectRam(ram)}
                                                className={`h-11 rounded-[5px] border text-[13px] font-semibold ${selectedRam === ram
                                                    ? "border-era-blue bg-white text-era-black"
                                                    : "border-era-line bg-era-white text-era-black"
                                                    }`}
                                            >
                                                {ram} GB
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {variantsForSelection.length > 0 && (
                                <div className="mt-7">
                                    <p className="text-[13px] font-bold">Almacenamiento</p>
                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {variantsForSelection.map((variant) => {
                                            const variantKey = getVariantKey(variant);

                                            return (
                                                <button
                                                    key={variantKey}
                                                    type="button"
                                                    onClick={() => setSelectedVariantKey(variantKey)}
                                                    className={`h-11 rounded-[5px] border text-[13px] font-semibold ${selectedVariantKey === variantKey
                                                        ? "border-era-blue bg-white text-era-black"
                                                        : "border-era-line bg-era-white text-era-black"
                                                        }`}
                                                >
                                                    {formatStorage(variant.storage_gb)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {colors.length > 0 ? (
                                <div className="mt-7">
                                    <p className="text-[13px] font-bold">
                                        Color: {selectedColor?.name ?? colors[0]?.name}
                                    </p>
                                    <div className="mt-4 flex gap-4">
                                        {colors.map((color) => (
                                            <button
                                                key={color.name}
                                                type="button"
                                                aria-label={`Elegir ${color.name}`}
                                                onClick={() => setSelectedColor(color)}
                                                className="h-10 w-10 rounded-full border border-era-line"
                                                style={{
                                                    backgroundColor: color.hex,
                                                    outline: selectedColor?.name === color.name ? "2px solid var(--era-blue)" : "none",
                                                    outlineOffset: "3px",
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-7 text-[13px] font-bold">
                                    Consultar por colores
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handleBuy}
                                className="mt-7 flex h-16 w-full cursor-pointer items-center justify-center gap-3 rounded-[4px] bg-era-black text-[18px] font-bold text-white"
                            >
                                <MessageCircle size={26} />
                                Consultar por WhatsApp
                            </button>
                            <p className="mt-4 text-[13px] font-semibold">
                                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-era-blue" />
                                Respondemos al instante
                            </p>
                            <p className="mt-2 text-[13px] text-era-text-muted">
                                ¿Tenés dudas? Escribinos y te asesoramos.
                            </p>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="border-y border-era-line">
                <div className="mx-auto grid max-w-[1420px] grid-cols-1 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
                    {detailBenefits.map(({ title, text, Icon }) => (
                        <div key={title} className="flex min-h-[76px] items-center gap-4 border-b border-era-line last:border-b-0 sm:px-2 lg:h-[92px] lg:border-b-0">
                            <Icon size={25} strokeWidth={1.7} />
                            <div>
                                <p className="text-[13px] font-bold">{title}</p>
                                <p className="text-[12px] text-era-text-muted">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1420px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
                <div className="max-w-[760px] border-t border-era-line py-8">
                    <h2 className="text-[24px] font-black">Descripción</h2>
                    <p className="mt-6 whitespace-pre-line text-[14px] leading-6 text-era-text-muted">
                        {product.description || "Producto original, sellado e importado. Consultanos para confirmar disponibilidad y configuración."}
                    </p>
                    <ul className="mt-8 space-y-5 text-[13px] font-semibold text-era-text-muted">
                        <li className="flex gap-3"><ShieldCheck size={18} /> Producto original y sellado.</li>
                        <li className="flex gap-3"><Box size={18} /> Entrega con accesorios incluidos.</li>
                        <li className="flex gap-3"><ShoppingBag size={18} /> Asesoramiento antes y después de comprar.</li>
                    </ul>
                </div>
            </section>

            <section className="mx-auto max-w-[1420px] border-t border-era-line px-5 py-8 sm:px-8 lg:px-12 lg:py-9">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-[24px] font-black">Preguntas frecuentes</h2>
                    <Link href="#" className="flex items-center gap-2 text-[12px] text-era-text-muted">
                        Ver todas las preguntas
                    </Link>
                </div>
                <div className="columns-2 gap-8">
                    {faqs.map((faq) => {
                        const isOpen = openFaq === faq.question;

                        return (
                            <div key={faq.question} className="mb-3 break-inside-avoid border border-era-line">
                                <button
                                    type="button"
                                    onClick={() => setOpenFaq(isOpen ? null : faq.question)}
                                    className="flex h-14 w-full items-center justify-between px-5 text-left text-[14px] font-bold"
                                    aria-expanded={isOpen}
                                >
                                    {faq.question}
                                    <span className="text-[24px] font-light">{isOpen ? "-" : "+"}</span>
                                </button>
                                {isOpen && (
                                    <p className="border-t border-era-line px-5 py-4 text-[13px] leading-5 text-era-text-muted">
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {relatedProducts.length > 0 && (
                <section className="mx-auto max-w-[1420px] border-t border-era-line px-5 py-8 sm:px-8 lg:px-12 lg:py-9">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-[24px] font-black">También te puede interesar</h2>
                        <Link href={`/products?brand=${product.brand}&category=${product.category}`} className="text-[12px] text-era-text-muted">
                            Ver todos los {product.category}
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-6">
                        {relatedProducts.map((related) => (
                            <RelatedCard key={related.id} product={related} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
