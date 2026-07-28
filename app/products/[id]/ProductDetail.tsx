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

const fallbackImages = [
    "/Iphone_HeroImage.jpeg",
    "/Macbook_HeroImage.jpeg",
    "/AirpodsMax_HeroImage.jpeg",
    "/Applewatch_HeroImage.jpeg",
];

const detailBenefits = [
    { title: "Garantia Apple Oficial", text: "", Icon: ShieldCheck },
    { title: "Retiro en Palermo", text: "Retira gratis en nuestra tienda", Icon: Store },
    { title: "Envios a todo el pais", text: "Rapido y seguro por Correo Andreani", Icon: Truck },
    { title: "Paga tranquilo", text: "Transferencia, tarjetas y mas", Icon: CreditCard },
];

const faqs = [
    {
        question: "¿Los productos son originales?",
        answer: "Todos nuestros equipos son originales y sellados.",
    },
    {
        question: "¿Hacen envios a todo el pais?",
        answer: "Si, hacemos envios mediante Correo Andreani a todo el pais.",
    },
    {
        question: "¿Tienen garantia?",
        answer: "Todos los equipos Apple tienen garantia oficial por 12 meses. Los demas equipos tienen garantia de 3 meses con nosotros mismos.",
    },
    {
        question: "¿Como puedo pagar?",
        answer: "Nuestros metodos de pago son USD o ARS. Tambien podes abonar en 6 cuotas fijas.",
    },
];

function formatStorage(storage: number) {
    return storage >= 1024 ? `${storage / 1024} TB` : `${storage} GB`;
}

function formatVariantOption(variant: Product["product_variants"][number]) {
    const storage = typeof variant.storage_gb === "number" ? formatStorage(variant.storage_gb) : "Consultar";
    return typeof variant.ram_gb === "number" ? `${variant.ram_gb}/${storage}` : storage;
}

function getVariantKey(variant: Product["product_variants"][number]) {
    return [variant.storage_gb ?? "", variant.ram_gb ?? "", variant.screen_inches ?? ""].join("-");
}

function matchesVariantKey(variant: Product["product_variants"][number], key: string | null) {
    return key === null || getVariantKey(variant) === key;
}

function sortVariants(variants: Product["product_variants"]) {
    return [...variants].sort((a, b) => {
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

function getProductColors(product: Product): ProductColor[] {
    const colors = new Map<string, ProductColor>();

    product.products_colors?.forEach((color) => colors.set(color.name, color));
    product.product_variants?.forEach((variant) => {
        if (!variant.color_name) return;

        colors.set(variant.color_name, {
            id: variant.color_name,
            name: variant.color_name,
            hex: variant.color_hex || colors.get(variant.color_name)?.hex || "#d8d8d8",
            image_url: variant.image_url ?? colors.get(variant.color_name)?.image_url ?? null,
        });
    });

    return Array.from(colors.values());
}

function RelatedCard({ product, index }: { product: Product; index: number }) {
    const variant = product.product_variants?.[0] ?? null;
    const image = product.image_url || variant?.image_url || fallbackImages[index % fallbackImages.length];
    const price = variant?.price_usd ?? product.price_usd;

    return (
        <article className="relative rounded-[8px] border border-era-line bg-white p-5">
            <Link href={`/products/${product.id}`} className="block">
                <div className="relative h-[190px]">
                    <Image src={image} alt={product.name} fill className="object-contain" sizes="16vw" />
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

    const mainImage =
        activeVariant?.image_url ??
        selectedColor?.image_url ??
        product.image_url ??
        fallbackImages[0];

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
        message += `. ¿Esta disponible?`;

        window.open(`https://wa.me/5491171254322?text=${encodeURIComponent(message)}`, "_blank");
    };

    return (
        <main className="min-h-screen bg-era-white text-era-black">
            <EraHeader />

            <section className="border-t border-era-line">
                <div className="mx-auto max-w-[1420px] px-12 py-8">
                    <p className="text-[13px] text-era-text-muted">
                        Inicio <span className="mx-3">/</span> {product.category} <span className="mx-3">/</span> {product.name}
                    </p>

                    <div className="mt-8 grid grid-cols-[760px_1fr] gap-14">
                        <div className="relative flex min-h-[700px] items-center justify-center rounded-[8px] bg-white">
                            <Image src={mainImage} alt={product.name} fill className="object-contain p-14" sizes="55vw" priority />
                        </div>

                        <aside className="pt-2">
                            <p className="text-[14px] font-bold">{product.brand}</p>
                            <h1 className="mt-4 text-[42px] font-black leading-tight tracking-[-0.04em]">
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
                                        <p className="text-[36px] font-black text-era-orange">
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

                            {variantOptions.length > 1 && (
                                <div className="mt-7">
                                    <p className="text-[13px] font-bold">Version</p>
                                    <div className="mt-4 grid grid-cols-4 gap-3">
                                        {variantOptions.map((variant) => {
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
                                                    {formatVariantOption(variant)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {colors.length > 0 && (
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
                                ¿Tenes dudas? Escribinos y te asesoramos.
                            </p>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="border-y border-era-line">
                <div className="mx-auto grid max-w-[1420px] grid-cols-4 px-12">
                    {detailBenefits.map(({ title, text, Icon }) => (
                        <div key={title} className="flex h-[92px] items-center gap-4">
                            <Icon size={25} strokeWidth={1.7} />
                            <div>
                                <p className="text-[13px] font-bold">{title}</p>
                                <p className="text-[12px] text-era-text-muted">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1420px] px-12 py-10">
                <div className="grid grid-cols-[390px_1fr] gap-16 border-t border-era-line py-8">
                    <div>
                        <h2 className="text-[24px] font-black">Descripcion</h2>
                        <p className="mt-6 whitespace-pre-line text-[14px] leading-6 text-era-text-muted">
                            {product.description || "Producto original, sellado e importado. Consultanos para confirmar disponibilidad y configuracion."}
                        </p>
                        <ul className="mt-8 space-y-5 text-[13px] font-semibold text-era-text-muted">
                            <li className="flex gap-3"><ShieldCheck size={18} /> Producto original y sellado.</li>
                            <li className="flex gap-3"><Box size={18} /> Entrega con accesorios incluidos.</li>
                            <li className="flex gap-3"><ShoppingBag size={18} /> Asesoramiento antes y despues de comprar.</li>
                        </ul>
                    </div>

                    <div className="relative h-[360px] overflow-hidden rounded-[6px]">
                        <Image src={fallbackImages[0]} alt={product.name} fill className="object-cover" sizes="60vw" />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1420px] border-t border-era-line px-12 py-9">
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
                <section className="mx-auto max-w-[1420px] border-t border-era-line px-12 py-9">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-[24px] font-black">Tambien te puede interesar</h2>
                        <Link href={`/products?brand=${product.brand}&category=${product.category}`} className="text-[12px] text-era-text-muted">
                            Ver todos los {product.category}
                        </Link>
                    </div>
                    <div className="grid grid-cols-5 gap-6">
                        {relatedProducts.map((related, index) => (
                            <RelatedCard key={related.id} product={related} index={index} />
                        ))}
                    </div>
                    <div className="mt-7 flex justify-center gap-2">
                        <span className="h-2 w-4 rounded-full bg-era-blue" />
                        <span className="h-2 w-2 rounded-full bg-era-line" />
                        <span className="h-2 w-2 rounded-full bg-era-line" />
                    </div>
                </section>
            )}
        </main>
    );
}
