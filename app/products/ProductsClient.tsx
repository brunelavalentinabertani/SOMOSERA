"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { Product } from "@/types/product";
import { calculatePrices } from "../../lib/pricing";
import { formatPrice } from "../../lib/formatPrices";

type Settings = {
  usd_rate: number;
  transfer_multiplier: number;
  list_multiplier: number;
};

const PRODUCTS_PER_PAGE = 12;
const mediaCategories = ["Fotografia", "Filmadoras", "Drones"];
const gamingCategories = ["Gaming", "Notebooks", "Consolas"];
const gamingFilterCategories = ["Notebooks", "Consolas"];
const appleCategoryOrder = ["Ipads", "Iphones", "Macbooks", "Applewatch", "Accesorios", "Imacs"];
const categoryLabels: Record<string, string> = {
  Applewatch: "Apple Watch",
  Fotografia: "Fotografía",
  Imacs: "iMacs",
  Ipads: "iPads",
  Iphones: "iPhone",
  Macbooks: "MacBooks",
};

function buildProductsHref(brand: string | null, category: string | null) {
  const params = new URLSearchParams();
  if (brand) params.set("brand", brand);
  if (category) params.set("category", category);
  return `/products?${params.toString()}`;
}

function formatCategoryLabel(category: string) {
  return categoryLabels[category] ?? category;
}

function isCategoryInGroup(category: string | null, group: string[]) {
  return group.some((item) => item.toLowerCase() === category?.toLowerCase());
}

function sortCategoryOptions(options: [string, number][], brand: string | null) {
  if (brand?.toLowerCase() !== "apple") {
    return options.sort(([a], [b]) => a.localeCompare(b));
  }

  return options.sort(([a], [b]) => {
    const indexA = appleCategoryOrder.indexOf(a);
    const indexB = appleCategoryOrder.indexOf(b);
    const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
    const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;

    if (safeIndexA !== safeIndexB) return safeIndexA - safeIndexB;
    return a.localeCompare(b);
  });
}

function sortVariants(variants: Product["product_variants"]) {
  return [...variants].sort((a, b) => {
    const storageDiff = (a.storage_gb ?? 0) - (b.storage_gb ?? 0);
    if (storageDiff !== 0) return storageDiff;
    return (a.ram_gb ?? 0) - (b.ram_gb ?? 0);
  });
}

function getProductImage(product: Product) {
  const variantImage = product.product_variants?.find((variant) => variant.image_url)?.image_url;
  const colorImage = product.products_colors?.find((color) => color.image_url)?.image_url;

  return variantImage ?? colorImage ?? product.image_url ?? null;
}

function ProductTile({
  product,
  settings,
}: {
  product: Product;
  settings: Settings | null;
}) {
  const sortedVariants = useMemo(() => sortVariants(product.product_variants ?? []), [product.product_variants]);
  const matchingVariant = sortedVariants[0] ?? null;

  const image = getProductImage(product);
  const price = matchingVariant ? matchingVariant.price_usd : product.price_usd ?? null;
  const shouldConsult = price === null || price <= 0;
  const prices = !shouldConsult && settings?.usd_rate
    ? calculatePrices(price, settings.usd_rate, {
      transferMultiplier: settings.transfer_multiplier,
      listMultiplier: settings.list_multiplier,
    })
    : null;

  return (
    <article className="relative flex min-h-[430px] flex-col rounded-[8px] border border-era-line bg-white p-4 sm:min-h-[500px] sm:p-5 lg:min-h-[520px] lg:p-6">
      <Link href={`/products/${product.id}`} className="relative block h-[150px] sm:h-[180px] lg:h-[190px]">
        {image ? (
          <Image src={image} alt={product.name} fill className="object-contain" sizes="18vw" />
        ) : (
          <span className="flex h-full items-center justify-center text-center text-[13px] font-semibold text-era-text-muted">
            Imagen no disponible
          </span>
        )}
      </Link>

      <div className="mt-6 flex flex-1 flex-col">
        <div className="flex min-h-[200px] flex-col justify-start gap-3 select-text sm:min-h-[230px]">
          <h3 className="min-h-[78px] text-[14px] font-black leading-tight sm:min-h-[92px] sm:text-[16px]">{product.name}</h3>

          {shouldConsult ? (
            <p className="text-[16px] font-black">CONSULTAR</p>
          ) : prices ? (
            <div className="space-y-3">
              <p className="text-[12px] font-semibold text-era-text-muted">
                6 cuotas fijas de: ${formatPrice(prices.installment6)}
              </p>
              <p className="text-[16px] font-black text-era-orange">
                ${formatPrice(prices.transferPrice)} en Transferencia
              </p>
              <p className="text-[13px] font-bold text-era-black">
                USD {price} en un pago
              </p>
            </div>
          ) : (
            <p className="text-[16px] font-black">USD {price}</p>
          )}
        </div>
        <Link
          href={`/products/${product.id}`}
          className="mt-auto flex h-10 items-center justify-center rounded-[4px] border border-era-gray-niebla text-[12px] font-bold transition hover:border-era-black"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

export default function ProductsClient({
  products,
  baseProducts,
  brand,
  category,
  activeModel,
}: {
  products: Product[];
  baseProducts: Product[];
  brand: string | null;
  category: string | null;
  activeModel: string | null;
}) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(true);
  const [brandFilterOpen, setBrandFilterOpen] = useState(true);
  const isMediaCategory =
    category?.toLowerCase() === "foto/video" || isCategoryInGroup(category, mediaCategories);
  const isGamingCategory = isCategoryInGroup(category, gamingCategories);

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

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();

    const groupedCategories = isMediaCategory
      ? mediaCategories
      : isGamingCategory
        ? gamingFilterCategories
        : null;

    if (groupedCategories) {
      groupedCategories.forEach((item) => {
        counts.set(item, 0);
      });

      baseProducts.forEach((product) => {
        const productCategory = product.category?.trim();
        if (productCategory && isCategoryInGroup(productCategory, groupedCategories)) {
          counts.set(productCategory, (counts.get(productCategory) ?? 0) + 1);
        }
      });

      return groupedCategories.map((item) => [item, counts.get(item) ?? 0] as [string, number]);
    }

    if (category && !brand) {
      return [[category, products.length] as [string, number]];
    }

    baseProducts.forEach((product) => {
      const productCategory = product.category?.trim();
      if (productCategory) {
        counts.set(productCategory, (counts.get(productCategory) ?? 0) + 1);
      }
    });

    return sortCategoryOptions(Array.from(counts.entries()), brand);
  }, [baseProducts, brand, category, isMediaCategory, isGamingCategory, products.length]);

  const brandOptions = useMemo(() => {
    const counts = new Map<string, number>();

    products.forEach((product) => {
      const productBrand = product.brand?.trim();
      if (productBrand) {
        counts.set(productBrand, (counts.get(productBrand) ?? 0) + 1);
      }
    });

    return Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const activeModelMatches = !activeModel || product.name.toLowerCase().includes(activeModel.toLowerCase());
    const brandMatches =
      (!isMediaCategory && !isGamingCategory) ||
      selectedBrands.length === 0 ||
      selectedBrands.includes(product.brand ?? "");

    return activeModelMatches && brandMatches;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PRODUCTS_PER_PAGE,
    safePage * PRODUCTS_PER_PAGE,
  );

  const toggleBrand = (productBrand: string) => {
    setSelectedBrands((current) =>
      current.includes(productBrand)
        ? current.filter((item) => item !== productBrand)
        : [...current, productBrand],
    );
    setCurrentPage(1);
  };

  return (
    <section className="mx-auto grid max-w-[1420px] grid-cols-1 gap-6 px-5 py-7 sm:px-8 lg:px-12 xl:grid-cols-[300px_1fr] xl:gap-8 xl:py-8">
      <aside className="space-y-6">
        <div className="rounded-[8px] border border-era-line bg-era-white p-5 sm:p-6">
          {categoryOptions.length > 0 && (
            <div className="border-b border-era-line pb-6">
              <button
                type="button"
                onClick={() => setCategoryFilterOpen((value) => !value)}
                className="flex w-full items-center justify-between text-[14px] font-black"
              >
                <span><span className="text-era-orange">*</span> Categoría</span>
                <ChevronDown size={18} className={`transition ${categoryFilterOpen ? "rotate-180" : ""}`} />
              </button>
              {categoryFilterOpen && (
                <div className="mt-5 space-y-4">
                  {categoryOptions.map(([productCategory, count]) => (
                    <Link
                      key={productCategory}
                      href={buildProductsHref(isMediaCategory || isGamingCategory ? null : brand, productCategory)}
                      className={`flex items-center justify-between text-[13px] hover:text-era-blue ${
                        productCategory.toLowerCase() === category?.toLowerCase() ? "font-bold text-era-blue" : ""
                      }`}
                    >
                      <span>{formatCategoryLabel(productCategory)}</span>
                      <span>{count}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {isMediaCategory || isGamingCategory ? (
            <div className={categoryOptions.length > 0 ? "pt-6" : ""}>
              <button
                type="button"
                onClick={() => setBrandFilterOpen((value) => !value)}
                className="flex w-full items-center justify-between text-[14px] font-black"
              >
                Marca
                <ChevronDown size={18} className={`transition ${brandFilterOpen ? "rotate-180" : ""}`} />
              </button>
              {brandFilterOpen && (
                <div className="mt-5 space-y-4">
                  {brandOptions.length > 0 ? (
                    brandOptions.map(([productBrand, count]) => (
                      <label key={productBrand} className="flex items-center justify-between text-[13px]">
                        <span className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(productBrand)}
                            onChange={() => toggleBrand(productBrand)}
                            className="h-4 w-4 accent-era-black"
                          />
                          {productBrand}
                        </span>
                        <span>{count}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-[13px] text-era-text-muted">Sin marcas cargadas</p>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
        <div className="hidden rounded-[8px] border border-era-line bg-white p-7 xl:block">
          <h3 className="text-[18px] font-black">¿Necesitás ayuda?</h3>
          <p className="mt-4 text-[13px] text-era-text-muted">
            Habla con nosotros por WhatsApp.
          </p>
          <Link
            href="https://wa.me/5491171254322"
            target="_blank"
            className="mt-6 flex h-11 w-fit items-center gap-3 rounded-[4px] bg-era-black px-5 text-[13px] font-bold text-white"
          >
            <MessageCircle size={18} />
            Escribinos
          </Link>
        </div>
      </aside>

      <div>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-[14px] font-semibold">{filteredProducts.length} productos</p>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 2xl:gap-5">
          {paginatedProducts.map((product) => (
            <ProductTile
              key={product.id}
              product={product}
              settings={settings}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-4">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 cursor-pointer rounded-[4px] border text-[13px] font-bold ${page === safePage
                  ? "border-era-black bg-era-black text-white"
                  : "border-era-line bg-era-white text-era-black"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
