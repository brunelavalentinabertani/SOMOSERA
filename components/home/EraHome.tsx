"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
    ArrowRight,
    MessageCircle,
    Package,
    ShieldCheck,
    ShoppingBag,
    Truck,
    Users,
} from "lucide-react";
import EraHeader from "../layout/EraHeader";

const instagramPosts = [
    { image: "/instagram/post-1.jpg", href: "https://www.instagram.com/iphoneba.store/reel/DWH1b9GEUU4/" },
    { image: "/instagram/post-2.jpg", href: "https://www.instagram.com/iphoneba.store/reel/DbJy9eLxkx5/" },
    { image: "/instagram/post-3.jpg", href: "https://www.instagram.com/iphoneba.store/p/Da3rMUIEZT-/" },
    { image: "/instagram/post-4.jpg", href: "https://www.instagram.com/iphoneba.store/reel/Dav9mQ_RKbu/" },
    { image: "/instagram/post-5.jpg", href: "https://www.instagram.com/iphoneba.store/reel/Dad7tqWx9qu/" },
    { image: "/instagram/post-6.jpg", href: "https://www.instagram.com/iphoneba.store/reel/DaTvpH9xr61/" },
];

const categories = [
    { name: "iPhone", href: "/products?brand=Apple&category=Iphones", image: "/Iphone_HeroImage.jpeg" },
    { name: "MacBook", href: "/products?brand=Apple&category=Macbooks", image: "/categories/macbook-v2.png" },
    { name: "iPad", href: "/products?brand=Apple&category=Ipads", image: "/categories/ipad-v2.png" },
    { name: "Apple Watch", href: "/products?brand=Apple&category=Applewatch", image: "/Applewatch_HeroImage.jpeg" },
    { name: "iMac", href: "/products?brand=Apple&category=Imacs", image: "/categories/imac-v2.png" },
    { name: "Accesorios", href: "/products?category=Accesorios", image: "/AirpodsMax_HeroImage.jpeg" },
    { name: "Kindle", href: "/products?category=Kindle", image: "/categories/kindle-v2.png" },
    { name: "Samsung", href: "/products?brand=Samsung", image: "/categories/samsung-v2.png" },
    { name: "Xiaomi", href: "/products?brand=Xiaomi", image: "/categories/xiaomi-v2.png" },
    { name: "Motorola", href: "/products?brand=Motorola&category=Celulares", image: "/categories/motorola-v2.png" },
    { name: "Foto/Video", href: "/products?category=Foto%2FVideo", image: "/categories/foto-video-v2.png" },
    { name: "Gaming", href: "/products?category=Gaming", image: "/categories/gaming-v2.png" },
    { name: "Notebooks", href: "/products?category=Notebooks", image: "/Macbook_HeroImage.jpeg" },
    { name: "Consolas", href: "/products?category=Consolas", image: "/categories/consolas-v2.png" },
];

const benefits = [
    { title: "Original", text: "Productos 100% originales", Icon: ShieldCheck },
    { title: "Sellado", text: "En caja cerrada de fábrica", Icon: Package },
    { title: "Garantia Apple Oficial", text: "", Icon: ShieldCheck },
    { title: "Atención real", text: "De personas, no bots", Icon: Users },
    { title: "Envíos a todo el país", text: "Rápido y seguro por Correo Andreani", Icon: Truck },
];

const why = [
    { title: "Compra simple", text: "Elegís, consultás y coordinamos por WhatsApp.", Icon: ShoppingBag },
    { title: "Asesoramiento real", text: "Te ayudamos a elegir el mejor producto.", Icon: MessageCircle },
    { title: "Entrega ágil", text: "Envíos a todo el país o retiro en Palermo.", Icon: Truck },
    { title: "Postventa presente", text: "Te acompañamos antes y después de tu compra.", Icon: ShieldCheck },
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

function PhotoTile({
    src,
    alt,
    className = "",
}: {
    src: string;
    alt: string;
    className?: string;
}) {
    return (
        <div className={`relative overflow-hidden bg-[#f3ece4] ${className}`}>
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                sizes="30vw"
            />
        </div>
    );
}

export default function EraHome() {
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-era-white text-era-black">
            <EraHeader />

            <section className="mx-auto grid max-w-[1420px] grid-cols-1 gap-7 px-5 pb-5 sm:px-8 lg:px-12 xl:grid-cols-[1fr_minmax(520px,820px)] xl:gap-10">
                <div className="flex min-h-[360px] flex-col justify-center py-10 xl:min-h-[455px] xl:py-0">
                    <h1 className="max-w-[560px] text-[48px] font-black leading-[0.96] tracking-[-0.04em] sm:text-[64px] xl:text-[78px]">
                        Comprá Tranquilo<span className="text-era-orange"> *</span>
                    </h1>
                    <p className="mt-6 max-w-[360px] text-[19px] leading-[1.28] text-era-text-muted sm:mt-8 sm:text-[24px]">
                        Tecnología importada, original y segura
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/products?brand=Apple&category=Iphones"
                            className="flex h-12 items-center justify-center gap-4 rounded-[4px] bg-era-black px-6 text-[13px] font-bold text-white sm:justify-start sm:px-8"
                        >
                            Ver catálogo
                            <ArrowRight size={17} />
                        </Link>
                        <Link
                            href="https://wa.me/5491171254322"
                            target="_blank"
                            className="flex h-12 items-center justify-center gap-3 rounded-[4px] border border-era-gray-niebla bg-white px-6 text-[13px] font-bold text-era-black sm:justify-start sm:px-8"
                        >
                            <MessageCircle size={17} />
                            Hablar por WhatsApp
                        </Link>
                    </div>
                </div>

                <div className="grid h-[360px] grid-cols-2 grid-rows-2 gap-1 sm:h-[400px] sm:grid-cols-[1fr_1.35fr_1fr] xl:h-[455px] xl:grid-cols-[240px_340px_1fr]">
                    <PhotoTile src="/home-macbook-blue-v2.png" alt="MacBook azul" className="sm:row-span-2" />
                    <PhotoTile src="/home-pocket-camera-v2.png" alt="Cámara compacta" className="sm:row-span-2" />
                    <PhotoTile src="/home-headphones-green-v2.png" alt="Auriculares verdes" />
                    <PhotoTile src="/home-imac-blue-v2.png" alt="iMac azul" />
                </div>
            </section>

            <section className="border-y border-era-line">
                <div className="mx-auto grid max-w-[1420px] grid-cols-1 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-5 lg:px-12">
                    {benefits.map(({ title, text, Icon }) => (
                        <div key={title} className="flex min-h-[74px] items-center gap-4 border-b border-era-line last:border-b-0 sm:px-2 lg:h-[86px] lg:border-b-0">
                            <Icon size={24} strokeWidth={1.7} />
                            <div>
                                <p className="text-[12px] font-bold">{title}</p>
                                <p className="text-[11px] text-era-text-muted">{text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1420px] px-5 py-8 sm:px-8 lg:px-12">
                <div className="mb-7 flex items-center justify-between">
                    <h2 className="text-[22px] font-black tracking-[-0.03em]">Explorá por categoría</h2>
                </div>

                <div className="flex gap-5 overflow-x-auto pb-3">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="relative h-[145px] min-w-[170px] overflow-hidden rounded-[4px] bg-era-line sm:h-[165px] sm:min-w-[205px]"
                        >
                            <Image src={category.image} alt={category.name} fill className="object-cover" sizes="14vw" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                            <span className="absolute bottom-4 left-4 text-[15px] font-bold text-white">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="border-y border-era-line">
                <div className="mx-auto max-w-[1420px] px-5 py-9 sm:px-8 lg:px-12">
                    <h2 className="mb-9 text-[22px] font-black tracking-[-0.03em]">¿Por qué elegir ERA?</h2>
                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-era-line">
                        {why.map(({ title, text, Icon }, index) => (
                            <div key={title} className={`flex gap-5 lg:gap-6 ${index === 0 ? "lg:pr-8" : "lg:px-8"}`}>
                                <Icon
                                    size={42}
                                    strokeWidth={1.5}
                                    className={index % 2 === 0 ? "text-era-blue" : "text-era-orange"}
                                />
                                <div>
                                    <h3 className="text-[14px] font-bold">{title}</h3>
                                    <p className="mt-2 max-w-[220px] text-[12px] leading-5 text-era-text-muted">{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-[1420px] grid-cols-1 gap-8 px-5 py-10 sm:px-8 lg:px-12 xl:grid-cols-[390px_1fr]">
                <div className="flex flex-col justify-center">
                    <span className="text-[42px] font-black leading-none text-era-orange">*</span>
                    <h2 className="mt-3 max-w-[340px] text-[34px] font-black leading-[0.98] tracking-[-0.04em] sm:text-[42px]">
                        Base en Palermo, Buenos Aires.
                    </h2>
                    <p className="mt-7 max-w-[305px] text-[13px] leading-5 text-era-text-muted">
                        Somos de acá. Conocemos lo que vendemos porque lo usamos. Todas las marcas en un mismo lugar.
                    </p>
                </div>

                <div className="grid h-[360px] grid-cols-2 gap-1 sm:h-[300px] sm:grid-cols-4 sm:[grid-template-columns:1.2fr_0.9fr_1.25fr_0.8fr]">
                    <PhotoTile src="/Macbook_HeroImage.jpeg" alt="Local ERA" />
                    <PhotoTile src="/Applewatch_HeroImage.jpeg" alt="Asesor ERA" />
                    <PhotoTile src="/Iphone_HeroImage.jpeg" alt="Cartel ERA" />
                    <PhotoTile src="/AirpodsMax_HeroImage.jpeg" alt="Café ERA" />
                </div>
            </section>

            <section className="mx-auto max-w-[1420px] border-t border-era-line px-5 py-8 sm:px-8 lg:px-12">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-[22px] font-black tracking-[-0.03em]">@somosera.</h2>
                    <Link href="https://www.instagram.com/iphoneba.store/" target="_blank" className="flex items-center gap-2 text-[12px] text-era-text-muted">
                        Ver en Instagram <ArrowRight size={15} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
                    {instagramPosts.map((post, index) => (
                        <Link
                            key={post.href}
                            href={post.href}
                            target="_blank"
                            aria-label={`Abrir publicación ${index + 1} de @iphoneba.store`}
                            className="group block"
                        >
                            <PhotoTile
                                src={post.image}
                                alt={`Publicación ${index + 1} de @iphoneba.store`}
                                className="h-[175px] rounded-[3px] transition group-hover:opacity-85"
                            />
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1420px] border-t border-era-line px-5 py-8 sm:px-8 lg:px-12">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-[22px] font-black tracking-[-0.03em]">Preguntas frecuentes</h2>
                </div>
                <div className="columns-1 gap-7 md:columns-2">
                    {faqs.map((faq) => {
                        const isOpen = openFaq === faq.question;

                        return (
                            <div key={faq.question} className="mb-3 break-inside-avoid border border-era-line bg-era-white">
                                <button
                                    type="button"
                                    onClick={() => setOpenFaq(isOpen ? null : faq.question)}
                                    className="flex h-[54px] w-full items-center justify-between px-5 text-left text-[14px] font-semibold"
                                    aria-expanded={isOpen}
                                >
                                    {faq.question}
                                    <span className="text-[24px] font-light">
                                        {isOpen ? "-" : "+"}
                                    </span>
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
        </main>
    );
}
