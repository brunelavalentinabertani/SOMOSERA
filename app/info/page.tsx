import Link from "next/link";
import { CreditCard, HelpCircle, ShieldCheck, Truck } from "lucide-react";
import EraHeader from "../../components/layout/EraHeader";

const sections = [
  {
    id: "preguntas-frecuentes",
    title: "Preguntas frecuentes",
    Icon: HelpCircle,
    items: [
      {
        title: "¿Los productos son originales?",
        text: "Sí. Trabajamos productos originales, importados y sellados. En cada compra te asesoramos para confirmar modelo, versión y disponibilidad.",
      },
      {
        title: "¿Hacen envíos a todo el país?",
        text: "Sí. Hacemos envíos a todo el país por Correo Andreani. También coordinamos retiro en Palermo, Buenos Aires.",
      },
      {
        title: "¿Cómo puedo consultar disponibilidad?",
        text: "Podés escribirnos por WhatsApp desde cualquier producto o desde el botón Escribinos. Te respondemos con stock, precio y forma de entrega.",
      },
    ],
  },
  {
    id: "envios-retiros",
    title: "Envíos y retiros",
    Icon: Truck,
    items: [
      {
        title: "Envíos por Andreani",
        text: "Enviamos a todo el país por Correo Andreani. Coordinamos los datos de envío por WhatsApp y te compartimos el seguimiento cuando el pedido queda despachado.",
      },
      {
        title: "Retiro en Palermo",
        text: "Si estás en Buenos Aires, podés coordinar retiro en Palermo. Te confirmamos horarios disponibles y el punto de entrega al cerrar la compra.",
      },
      {
        title: "Preparación del pedido",
        text: "Revisamos y preparamos cada pedido con cuidado antes de entregarlo o despacharlo.",
      },
    ],
  },
  {
    id: "formas-de-pago",
    title: "Formas de pago",
    Icon: CreditCard,
    items: [
      {
        title: "USD o ARS",
        text: "Nuestros productos pueden abonarse en USD o en pesos argentinos según la cotización vigente publicada en la tienda.",
      },
      {
        title: "Transferencia",
        text: "Mostramos el precio en transferencia en cada producto para que puedas verlo claro antes de consultar.",
      },
      {
        title: "Tarjetas de crédito",
        text: "Aceptamos todas las tarjetas de crédito salvo American Express.",
      },
    ],
  },
  {
    id: "garantia",
    title: "Garantía",
    Icon: ShieldCheck,
    items: [
      {
        title: "Garantía Apple oficial",
        text: "Los equipos Apple cuentan con garantía oficial por 12 meses.",
      },
      {
        title: "Otras marcas",
        text: "Los demás equipos cuentan con garantía de 3 meses con nosotros.",
      },
      {
        title: "Acompañamiento",
        text: "Te acompañamos antes y después de la compra para que tengas una experiencia clara y segura.",
      },
    ],
  },
];

export default function InfoPage() {
  return (
    <main className="min-h-screen bg-era-white text-era-black">
      <EraHeader />

      <section className="border-t border-era-line">
        <div className="mx-auto max-w-[1420px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          <p className="text-[13px] text-era-text-muted">
            Inicio <span className="mx-3">/</span> Info
          </p>
          <h1 className="mt-8 max-w-[760px] text-[44px] font-black leading-[0.95] tracking-[-0.05em] sm:text-[60px] lg:mt-10 lg:text-[76px]">
            Info clara para comprar tranquilo<span className="text-era-orange"> *</span>
          </h1>
          <p className="mt-6 max-w-[520px] text-[18px] leading-[1.35] text-era-text-muted sm:mt-8 sm:text-[22px]">
            Envíos, pagos, garantía y preguntas frecuentes, todo en un solo lugar.
          </p>

          <div className="mt-12 flex flex-wrap gap-3">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`/info#${section.id}`}
                className="rounded-[4px] border border-era-gray-niebla px-5 py-3 text-[13px] font-bold transition hover:border-era-black"
              >
                {section.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1420px] px-5 sm:px-8 lg:px-12">
        {sections.map(({ id, title, Icon, items }) => (
          <section key={id} id={id} className="scroll-mt-24 border-t border-era-line py-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[310px_1fr] lg:gap-16">
              <div>
                <Icon size={38} strokeWidth={1.5} />
                <h2 className="mt-6 text-[34px] font-black leading-tight tracking-[-0.04em]">
                  {title}<span className="text-era-orange"> *</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
                {items.map((item) => (
                  <article key={item.title} className="rounded-[8px] border border-era-line bg-white p-6">
                    <h3 className="text-[15px] font-black leading-tight">{item.title}</h3>
                    <p className="mt-4 text-[13px] leading-6 text-era-text-muted">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
