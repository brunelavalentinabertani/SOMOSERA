import Image from "next/image";
import { notFound } from "next/navigation";
import { Package, ShieldCheck, Star, Truck, Users } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import EraHeader from "../../components/layout/EraHeader";
import ProductsClient from "./ProductsClient";

type ProductsSearchParams = {
  brand?: string;
  category?: string;
  model?: string;
};

const mediaCategories = ["Fotografia", "Filmadoras"];
const gamingCategories = ["Gaming", "Notebooks", "Consolas"];

const benefits = [
  { title: "Original", text: "Productos 100% originales", Icon: ShieldCheck },
  { title: "Sellado", text: "En caja cerrada de fabrica", Icon: Package },
  { title: "Garantia Apple Oficial", text: "", Icon: Star },
  { title: "Atencion real", text: "De personas, no bots", Icon: Users },
  { title: "Envios a todo el pais", text: "Rapido y seguro por Correo Andreani", Icon: Truck },
];

const heroCopy: Record<string, { title: string; description: string; image: string }> = {
  Apple: {
    title: "Apple",
    description: "iPhone, iPad, Mac, Apple Watch y accesorios originales para tu ecosistema.",
    image: "/Iphone_HeroImage.jpeg",
  },
  Iphones: {
    title: "iPhone",
    description: "iPhone originales, importados. Tecnologia que te acompana, todos los dias.",
    image: "/Iphone_HeroImage.jpeg",
  },
  Macbooks: {
    title: "MacBook",
    description: "Potencia, diseno y portabilidad para trabajar, crear y estudiar con confianza.",
    image: "/Macbook_HeroImage.jpeg",
  },
  Ipads: {
    title: "iPad",
    description: "Pantallas versatiles para crear, mirar, estudiar y llevar todo con vos.",
    image: "/Applewatch_HeroImage.jpeg",
  },
  Applewatch: {
    title: "Apple Watch",
    description: "Relojes Apple originales para entrenar, organizarte y estar conectado.",
    image: "/Applewatch_HeroImage.jpeg",
  },
  Imacs: {
    title: "iMac",
    description: "Equipos de escritorio Apple para trabajar, crear y estudiar con potencia.",
    image: "/Macbook_HeroImage.jpeg",
  },
  Samsung: {
    title: "Samsung",
    description: "Celulares, tablets, relojes y accesorios Samsung importados y originales.",
    image: "/Iphone_HeroImage.jpeg",
  },
  Accesorios: {
    title: "Accesorios",
    description: "Cargadores, cables y accesorios originales para completar tu setup.",
    image: "/AirpodsMax_HeroImage.jpeg",
  },
  Fotografia: {
    title: "Fotografia",
    description: "Camaras, lentes y accesorios para crear contenido con calidad profesional.",
    image: "/Iphone_HeroImage.jpeg",
  },
  Filmadoras: {
    title: "Filmadoras",
    description: "Equipos de video y produccion profesional, listos para sumar al catalogo.",
    image: "/Iphone_HeroImage.jpeg",
  },
  Gaming: {
    title: "Gaming",
    description: "Consolas, notebooks y accesorios gaming importados.",
    image: "/Macbook_HeroImage.jpeg",
  },
  Notebooks: {
    title: "Notebooks",
    description: "Notebooks gamer con placas dedicadas, pantallas rapidas y configuraciones listas para jugar.",
    image: "/Macbook_HeroImage.jpeg",
  },
  Consolas: {
    title: "Consolas",
    description: "PlayStation, Nintendo, Xbox, realidad virtual y accesorios para jugar con confianza.",
    image: "/AirpodsMax_HeroImage.jpeg",
  },
  Kindle: {
    title: "Kindle",
    description: "Lectores Kindle para leer comodo, viajar liviano y llevar tu biblioteca siempre encima.",
    image: "/Iphone_HeroImage.jpeg",
  },
};
function normalize(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

function isCategoryInGroup(value: string | null, group: string[]) {
  return group.some((item) => normalize(item) === normalize(value));
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}) {
  const params = await searchParams;
  const brand = params.brand?.trim() || null;
  const rawCategory = params.category?.trim() || null;
  const category = normalize(rawCategory) === "foto/video" ? "Fotografia" : rawCategory;
  const model = params.model?.trim() || null;

  if (!brand && !category) {
    notFound();
  }

  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      name,
      brand,
      category,
      description,
      image_url,
      usd_rate,
      price_usd,
      product_variants (
        id,
        color_name,
        color_hex,
        storage_gb,
        ram_gb,
        screen_inches,
        price_usd,
        image_url
      ),
      products_colors (
        id,
        name,
        hex,
        image_url
      )
    `)
    .order("created_at", { ascending: false });

  const allProducts = products ?? [];
  const isGamingCategory = isCategoryInGroup(category, gamingCategories);
  const contextProducts = allProducts.filter((product) => {
    const brandMatches = !brand || normalize(product.brand) === normalize(brand);
    const categoryMatches = !category || (
      isGamingCategory && normalize(category) === "gaming"
        ? isCategoryInGroup(product.category, gamingCategories)
        : normalize(product.category) === normalize(category)
    );
    return brandMatches && categoryMatches;
  });

  const isEmptyMediaCategory = category ? isCategoryInGroup(category, mediaCategories) : false;
  const isEmptyGamingCategory = category ? isCategoryInGroup(category, gamingCategories) : false;

  if (contextProducts.length === 0 && !isEmptyMediaCategory && !isEmptyGamingCategory) {
    notFound();
  }

  const baseProducts = allProducts.filter((product) => {
    if (brand) return normalize(product.brand) === normalize(brand);
    return true;
  });

  const heroKey = category ?? brand ?? "Productos";
  const hero = heroCopy[heroKey] ?? {
    title: category ?? brand ?? "Productos",
    description: "Productos originales, importados y sellados.",
    image: "/Iphone_HeroImage.jpeg",
  };

  return (
    <main className="min-h-screen bg-era-white text-era-black">
      <EraHeader />

      <section className="border-t border-era-line">
        <div className="mx-auto grid max-w-[1420px] grid-cols-1 px-5 sm:px-8 lg:px-12 xl:grid-cols-[520px_1fr]">
          <div className="flex min-h-[330px] flex-col justify-center py-10 xl:min-h-[420px] xl:py-0 xl:pr-12">
            <p className="mb-8 text-[13px] text-era-text-muted xl:mb-12">
              Inicio <span className="mx-3">›</span> {hero.title}
            </p>
            <h1 className="text-[48px] font-black leading-none tracking-[-0.05em] sm:text-[64px] xl:text-[78px]">
              {hero.title}<span className="text-era-orange"> *</span>
            </h1>
            <p className="mt-6 max-w-[430px] text-[19px] leading-[1.35] text-era-text-muted sm:mt-8 sm:text-[24px]">
              {hero.description}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-10 xl:mt-12">
              <div className="flex items-center gap-4">
                <Truck size={28} strokeWidth={1.7} />
                <div>
                  <p className="text-[14px] font-bold">Envíos a todo el país</p>
                  <p className="text-[12px] text-era-text-muted">Rapido y seguro por Correo Andreani</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck size={28} strokeWidth={1.7} />
                <div>
                  <p className="text-[14px] font-bold">Garantia Apple Oficial</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[260px] sm:min-h-[360px] xl:min-h-[420px]">
            <Image
              src={hero.image}
              alt={hero.title}
              fill
              priority
              className="object-cover"
            />
          </div>
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

      <ProductsClient
        products={contextProducts}
        baseProducts={baseProducts}
        brand={brand}
        category={category}
        activeModel={model}
      />
    </main>
  );
}
