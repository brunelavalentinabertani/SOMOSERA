"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

const launchCards = [
  {
    id: "862cddaa-2cee-46e5-acb3-f4430398b881",
    description: "Dale vida a tus vlogs, entrevistas y contenidos en movimiento.",
    image: "https://zomiozxppjolsmjvaxbv.supabase.co/storage/v1/object/public/products/FotosERA/dji%20osmo%20pocket%204%20pro%20vlog%20combo.webp",
  },
  {
    id: "b5f44730-049b-49ce-8e84-f54ff5169d52",
    description: "Llevá tus ideas a cada viaje y convertí tus momentos en contenido.",
    image: "https://zomiozxppjolsmjvaxbv.supabase.co/storage/v1/object/public/products/FotosERA/DJI%20OSMO%20POCKET%204%20CREATOR%20COMBO.webp",
  },
];

export type LaunchProduct = {
  id: string;
  name: string;
  price_usd: number | null;
};

type PopupProduct = LaunchProduct & (typeof launchCards)[number];

function whatsappHref(product: PopupProduct) {
  const message = `Hola! Quiero consultar por la ${product.name} para crear contenido. ¿Está disponible?`;
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
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-era-orange">DJI para creadores</p>
          <h2 id="launch-popup-title" className="mt-2 text-[28px] font-black leading-none tracking-[-0.04em] sm:text-[38px]">
            Tu próxima historia empieza con Osmo<span className="text-era-orange"> *</span>
          </h2>
          <p className="mt-3 text-[13px] text-era-text-muted sm:text-[14px]">
            Vlogs, viajes y nuevas ideas: elegí tu Osmo Pocket y consultanos por WhatsApp.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {popupProducts.map((product) => (
            <article key={product.name} className="flex min-h-0 flex-col rounded-[8px] border border-era-line bg-white p-4 sm:p-5">
              <div className="relative h-[155px] sm:h-[210px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 640px) 80vw, 380px"
                />
              </div>
              <div className="mt-4 flex flex-1 flex-col">
                <h3 className="text-[18px] font-black leading-tight sm:text-[21px]">{product.name}</h3>
                <p className="mt-2 text-[12px] font-semibold text-era-text-muted">
                  {product.description}
                </p>
                <p className="mt-3 text-[18px] font-black text-era-orange">
                  {product.price_usd
                    ? `USD ${new Intl.NumberFormat("es-AR").format(product.price_usd)}`
                    : "Consultar"}
                </p>
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
      </section>
    </div>
  );
}
