import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Instagram,
  MessageCircle,
  Package,
  Truck,
} from "lucide-react";
import EraHeader from "../../components/layout/EraHeader";

const whatsappHref = "https://wa.me/5491171254322";
const instagramHref = "https://www.instagram.com/iphoneba.store/";

const heroImages = [
  { src: "/about/hero-man.png", alt: "Retrato ERA Palermo", className: "col-span-2 row-span-2" },
  { src: "/about/portrait-subway.png", alt: "ERA en Buenos Aires", className: "" },
  { src: "/about/phone-wall.png", alt: "Consulta por WhatsApp", className: "" },
  { src: "/about/beanie.png", alt: "ERA estilo urbano", className: "" },
  { src: "/about/top-view.png", alt: "ERA Palermo calle", className: "" },
];

const history = [
  ["01", "Empezamos con una idea", "Sin pensar en el resultado"],
  ["02", "Crecimos con ustedes", "Clientes de todo el pais nos eligen cada dia"],
  ["03", "Nos transformamos", "Y ahora somos la nueva era."],
];

const steps = [
  { number: "01", title: "Te escuchamos", text: "Entendemos lo que necesitas.", Icon: MessageCircle },
  { number: "02", title: "Te asesoramos", text: "Te ayudamos a elegir lo mejor para vos.", Icon: Package },
  { number: "03", title: "Lo preparamos", text: "Revisamos y enviamos con cuidado.", Icon: CheckCircle2 },
  { number: "04", title: "Lo recibis", text: "En tu casa, en todo el pais.", Icon: Truck },
];

function Photo({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-era-line ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="50vw" />
    </div>
  );
}

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-era-white text-era-black">
      <EraHeader />

      <section className="border-t border-era-line">
        <div className="mx-auto grid max-w-[1420px] grid-cols-[440px_1fr] py-8">
          <div className="flex min-h-[560px] flex-col justify-center px-12">
            <h1 className="text-[82px] font-black leading-[0.92] tracking-[-0.05em]">
              Somos<br />ERA.<span className="text-era-orange"> *</span>
            </h1>
            <p className="mt-10 max-w-[310px] text-[14px] leading-6 text-era-text-muted">
              Nueva era. Misma esencia.
            </p>
            <Link
              href={whatsappHref}
              target="_blank"
              className="mt-10 flex h-11 w-fit items-center gap-3 rounded-[4px] bg-era-black px-6 text-[13px] font-bold text-white"
            >
              <MessageCircle size={18} />
              Escribinos
            </Link>
          </div>

          <div className="grid h-[560px] grid-cols-4 grid-rows-2 gap-1">
            {heroImages.map((image) => (
              <Photo key={image.src} {...image} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-era-line">
        <div className="mx-auto grid max-w-[1420px] grid-cols-[280px_1fr_300px] gap-10 px-12 py-12">
          <h2 className="text-[24px] font-black">
            Nuestra historia <span className="text-era-orange">*</span>
          </h2>
          <div className="grid grid-cols-3 gap-10">
            {history.map(([number, title, text]) => (
              <div key={number}>
                <div className="flex items-center gap-3">
                  <span className="text-[18px] font-black">{number}</span>
                  <span className="h-px flex-1 bg-era-gray-niebla" />
                </div>
                <h3 className="mt-5 text-[13px] font-black">{title}</h3>
                <p className="mt-2 max-w-[190px] text-[12px] leading-5 text-era-text-muted">{text}</p>
              </div>
            ))}
          </div>
          <Link
            href={instagramHref}
            target="_blank"
            className="flex h-[150px] flex-col justify-between rounded-[6px] border border-era-line bg-white p-6 transition hover:border-era-black"
          >
            <div className="flex items-center justify-between">
              <Instagram size={24} strokeWidth={1.7} />
              <span className="text-[12px] font-bold text-era-orange">*</span>
            </div>
            <div>
              <p className="text-[28px] font-black leading-none">11 mil</p>
              <p className="mt-2 text-[12px] font-semibold text-era-text-muted">seguidores</p>
              <p className="mt-3 text-[13px] font-bold">@somosera.</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="border-b border-era-line">
        <div className="mx-auto grid max-w-[1420px] grid-cols-[1fr_390px] px-12 py-10">
          <div className="relative h-[420px] overflow-hidden bg-era-line">
            <Image
              src="/about/brune-gian.png"
              alt="Brune y Gian"
              fill
              className="object-cover"
              style={{ objectPosition: "50% 38%" }}
              sizes="60vw"
            />
          </div>
          <div className="flex min-h-[380px] flex-col justify-center pl-12">
            <h2 className="text-[24px] font-black">
              Lo que nos define<span className="text-era-orange"> *</span>
            </h2>
            <h3 className="mt-20 text-[30px] font-black">Somos Brune y Gian</h3>
            <p className="mt-6 max-w-[320px] text-[13px] leading-6 text-era-text-muted">
              Una pareja que nunca se queda quieta, tiene mil ideas y siempre va por mas. Creamos ERA desde la necesidad de construir una marca que represente quienes somos y lo que queremos transmitir. Incentivando que todos nuestros clientes se sientan parte de la nueva ERA.
            </p>
            <Link
              href={instagramHref}
              target="_blank"
              className="mt-14 flex items-center gap-3 text-[13px] font-bold"
            >
              <Instagram size={18} />
              @somosera.
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-era-line">
        <div className="mx-auto grid max-w-[1420px] grid-cols-[260px_1fr] gap-14 px-12 py-10">
          <h2 className="text-[22px] font-black">
            Como se vive ERA <span className="text-era-orange">*</span>
          </h2>
          <div className="grid grid-cols-4 gap-12">
            {steps.map(({ number, title, text, Icon }) => (
              <div key={number} className="grid grid-cols-[34px_1fr] gap-4">
                <span className="text-[14px] font-black">{number}</span>
                <div>
                  <Icon size={36} strokeWidth={1.5} />
                  <h3 className="mt-5 text-[13px] font-black">{title}</h3>
                  <p className="mt-2 text-[12px] leading-5 text-era-text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1420px] px-12 py-14">
        <div className="relative h-[230px] overflow-hidden rounded-[8px] bg-era-black">
          <Image
            src="/about/whatsapp-banner-v2.png"
            alt="Escribinos por WhatsApp"
            fill
            className="object-cover opacity-70"
            style={{ objectPosition: "60% 72%" }}
            sizes="90vw"
          />
          <div className="relative z-10 flex h-full flex-col justify-center px-12 text-white">
            <p className="text-[13px]">¿Tenes dudas?</p>
            <h2 className="mt-3 text-[32px] font-black">
              Escribinos por WhatsApp.<span className="text-era-orange"> *</span>
            </h2>
            <Link
              href={whatsappHref}
              target="_blank"
              className="mt-7 flex h-12 w-fit items-center gap-3 rounded-[4px] bg-white px-7 text-[13px] font-bold text-era-black"
            >
              <MessageCircle size={18} />
              Escribinos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
