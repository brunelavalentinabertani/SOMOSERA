import Image from "next/image";
import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

const message = encodeURIComponent("¡Hola! Quiero información sobre sus productos.");

const infoLinks = [
    { label: "Preguntas frecuentes", href: "/info#preguntas-frecuentes" },
    { label: "Envíos y retiros", href: "/info#envios-retiros" },
    { label: "Formas de pago", href: "/info#formas-de-pago" },
    { label: "Garantía", href: "/info#garantia" },
];

export default function Footer() {
    return (
        <footer className="border-t border-era-line bg-era-white text-era-black select-none">
            <div className="mx-auto max-w-[1420px] px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.95fr_1fr_1fr] lg:gap-16">
                    <div>
                        <Image
                            src="/era-logo-transparent.png"
                            alt="ERA"
                            width={1219}
                            height={367}
                            className="h-auto w-[120px] object-contain"
                        />
                        <p className="mt-7 text-[13px] font-semibold">
                            Nueva <span className="text-era-blue">era.</span> Misma esencia.
                        </p>
                        <div className="mt-7 flex gap-5 text-era-black">
                            <Link
                                href="https://www.instagram.com/iphoneba.store/"
                                target="_blank"
                                aria-label="Instagram somosera"
                                className="cursor-pointer"
                            >
                                <Instagram size={18} strokeWidth={1.8} />
                            </Link>
                            <Link
                                href={`https://wa.me/5491171254322?text=${message}`}
                                target="_blank"
                                aria-label="WhatsApp ERA"
                                className="cursor-pointer"
                            >
                                <MessageCircle size={18} strokeWidth={1.8} />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[13px] font-black">Info</h4>
                        <ul className="mt-5 space-y-2 text-[12px] text-era-text-muted">
                            {infoLinks.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="hover:text-era-black">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[13px] font-black">Contacto</h4>
                        <dl className="mt-5 space-y-3 text-[12px] text-era-text-muted">
                            <div>
                                <dt className="font-bold text-era-black">WhatsApp</dt>
                                <dd>+54 9 11 7125-4322</dd>
                            </div>
                            <div>
                                <dt className="font-bold text-era-black">Ubicación</dt>
                                <dd>Palermo, Buenos Aires</dd>
                            </div>
                        </dl>
                    </div>

                    <div>
                        <h4 className="text-[13px] font-black">Escribinos</h4>
                        <p className="mt-5 max-w-[210px] text-[12px] leading-5 text-era-text-muted">
                            Te respondemos por WhatsApp.
                        </p>
                        <Link
                            href={`https://wa.me/5491171254322?text=${message}`}
                            target="_blank"
                            className="mt-6 flex h-12 w-[170px] items-center justify-center gap-3 rounded-[4px] bg-era-black text-[13px] font-bold text-white"
                        >
                            <MessageCircle size={18} />
                            Abrir chat
                        </Link>
                    </div>
                </div>
            </div>

            <div className="border-t border-era-line">
                <div className="mx-auto flex min-h-14 max-w-[1420px] flex-col items-start justify-center gap-1 px-5 py-3 text-[11px] text-era-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
                    <p>2026 ERA. Todos los derechos reservados.</p>
                    <p>
                        Palermo, Buenos Aires <span className="ml-4 text-lg font-black text-era-orange">*</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
