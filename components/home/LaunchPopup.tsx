"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, X } from "lucide-react";
import { MOTHER_DAY_DISCOUNT_CODE, MOTHER_DAY_DISCOUNT_USD } from "../../lib/motherDayProducts";

const launchCards = [
  {
    id: "465d166e-e94b-4367-80e2-37a56326aa2f",
    description: "Un regalo para acompañar cada momento, entrenamiento y plan del día.",
  },
  {
    id: "57311d13-6db5-41b1-9790-abf82d979ed4",
    description: "Pantalla increíble, gran cámara y espacio de sobra para todos sus recuerdos.",
  },
];

export type LaunchProduct = {
  id: string;
  name: string;
  price_usd: number | null;
  image_url: string | null;
};

type PopupProduct = LaunchProduct & (typeof launchCards)[number];

function whatsappHref(product: PopupProduct) {
  const message = `¡Hola! Estoy buscando un regalo para mamá y quiero consultar por ${product.name} con el código ${MOTHER_DAY_DISCOUNT_CODE}. ¿Está disponible?`;
  return `https://wa.me/5491171254322?text=${encodeURIComponent(message)}`;
}

export default function LaunchPopup({ products }: { products: LaunchProduct[] }) {
  const [isOpen, setIsOpen] = useState(true);
  const popupProducts = launchCards.flatMap((card) => {
    const product = products.find((item) => item.id === card.id);
    return product ? [{ ...card, ...product }] : [];
  });

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-[2px] sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="launch-popup-title"
        className="relative my-auto w-full max-w-[880px] overflow-hidden rounded-[12px] bg-[#f7f4ef] p-5 shadow-2xl sm:p-7 lg:p-9"
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar novedad"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-era-black shadow-sm transition hover:bg-era-black hover:text-white"
        >
          <X size={19} />
        </button>

        <div className="pr-12">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-era-orange">Especial Día de la Madre</p>
          <h2 id="launch-popup-title" className="mt-2 text-[28px] font-black leading-none tracking-[-0.04em] sm:text-[38px]">
            ¡Descuentos exclusivos para mamá!<span className="text-era-orange"> *</span>
          </h2>
          <p className="mt-3 text-[13px] text-era-text-muted sm:text-[14px]">
            Elegí su regalo, usá el código <strong className="text-era-black">{MOTHER_DAY_DISCOUNT_CODE}</strong> y ahorrá USD {MOTHER_DAY_DISCOUNT_USD}.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {popupProducts.map((product) => (
            <article key={product.name} className="flex min-h-0 flex-col rounded-[8px] border border-era-line bg-white p-4 sm:p-5">
              <div className="relative h-[155px] sm:h-[210px]">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 640px) 80vw, 380px"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-[13px] font-semibold text-era-text-muted">
                    Imagen no disponible
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-1 flex-col">
                <h3 className="text-[18px] font-black leading-tight sm:text-[21px]">{product.name}</h3>
                <p className="mt-2 text-[12px] font-semibold text-era-text-muted">
                  {product.description}
                </p>
                {product.price_usd ? (
                  <div className="mt-3">
                    <p className="text-[12px] font-bold text-era-text-muted line-through">
                      USD {new Intl.NumberFormat("es-AR").format(product.price_usd)}
                    </p>
                    <p className="text-[18px] font-black text-era-orange">
                      USD {new Intl.NumberFormat("es-AR").format(Math.max(product.price_usd - MOTHER_DAY_DISCOUNT_USD, 0))} con código
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-[18px] font-black text-era-orange">Consultar</p>
                )}
                <a
                  href={whatsappHref(product)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex h-11 items-center justify-center gap-2 rounded-[4px] bg-era-black px-4 text-[12px] font-bold text-white transition hover:bg-era-blue"
                >
                  <MessageCircle size={17} />
                  Consultar por WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>

        <Link
          href="/felizdiamama"
          onClick={() => setIsOpen(false)}
          className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-[4px] border border-era-black text-[13px] font-black text-era-black transition hover:bg-era-black hover:text-white"
        >
          Ver más descuentos
          <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
