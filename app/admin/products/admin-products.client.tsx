"use client";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Checkbox } from "../../../src/components/ui/checkbox";

type Variant = {
  id: string;
  price_usd: number;
  color_name: string;
  storage_gb: number;
};

type Product = {
  id: string;
  name: string;
  price_usd: number | null;
  category?: string;
  Featured: boolean;
  product_variants?: Variant[];
};

type EditableItem = {
  type: "product" | "variant";
  id: string;
  name: string;
  price_usd: number | null;
  category?: string;
  Featured?: boolean;
  parentProductId?: string;
};

const CATEGORIES = [
  "Todos",
  "Iphones",
  "Apple Watch",
  "Ipads",
  "Macbooks",
  "Accesorios",
  "Samsung",
  "Motorola",
  "Xiaomi",
  "Sony",
  "Xbox",
];

export default function AdminProductsClient({
  products,
}: {
  products: Product[];
}) {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  // 🔥 1️⃣ Crear lista plana unificada
  const editableItems = useMemo(() => {
  const items: EditableItem[] = [];

  const shouldShowVariants = (product: Product) => {
    const variants = product.product_variants ?? [];
    if (variants.length === 0) return false;

    // si todos los precios son iguales, no mostramos variantes
    const prices = variants
      .map((v) => v.price_usd)
      .filter((p): p is number => typeof p === "number");

    if (prices.length === 0) return false;

    const unique = new Set(prices.map((p) => Number(p)));
    return unique.size > 1; // ✅ solo si hay más de un precio distinto
  };

  for (const product of products) {
    const showVariants = shouldShowVariants(product);

    if (!showVariants) {
      items.push({
        type: "product",
        id: product.id,
        name: product.name,
        price_usd: product.price_usd ?? null,
        category: product.category,
        Featured: product.Featured,
      });
      continue;
    }

    for (const variant of product.product_variants ?? []) {
      items.push({
        type: "variant",
        id: variant.id,
        name: `${product.name} - ${variant.storage_gb ?? ""}GB - ${
          variant.color_name ?? "Sin color"
        }`,
        price_usd: variant.price_usd ?? null,
        category: product.category,
        parentProductId: product.id,
      });
    }
  }

  return items;
}, [products]);


  // 🔥 2️⃣ Filtro por categoría + buscador
  const filteredItems = editableItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "Todos" ||
      item.category === selectedCategory;

    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleDelete = async (productId: string, name: string) => {
    const ok = confirm(`¿Eliminar el producto "${name}"?`);
    if (!ok) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error(error);
      alert("Error al eliminar producto");
      return;
    }

    alert("Producto eliminado con éxito ✅");
    router.refresh();
  };

  const toggleDestacado = async (productId: string, value: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ Featured: value })
      .eq("id", productId);

    if (error) {
      console.error(error);
      alert("Error al actualizar destacado");
      return;
    }

    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">Productos</h1>

        {/* 🔎 BUSCADOR */}
        <input
          type="text"
          placeholder="Buscar producto o variante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />

        {/* 📂 CATEGORÍAS */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded border text-sm ${
                selectedCategory === category
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="border px-3 py-1 rounded w-fit"
        >
          Volver a admin
        </button>
      </div>

      {/* 📦 LISTA */}
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border rounded p-3"
        >
          <div>
            <p className="font-medium">
              {item.name}
              {item.type === "variant" && (
                <span className="text-xs ml-2 text-gray-500">
                  (Variante)
                </span>
              )}
            </p>

            <p className="text-sm text-muted-foreground">
              USD {item.price_usd ?? "-"}
            </p>
          </div>

          {/* Solo productos pueden ser destacados */}
          {item.type === "product" && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={item.Featured}
                onCheckedChange={(value) =>
                  toggleDestacado(item.id, value === true)
                }
              />
              <span className="text-sm">Destacado</span>
            </div>
          )}

          {/* Editar */}
          {item.type === "product" ? (
            <Link
              href={`/admin/products/${item.id}`}
              className="text-sm text-blue-600"
            >
              Editar
            </Link>
          ) : (
            <Link
              href={`/admin/variants/${item.id}`}
              className="text-sm text-blue-600"
            >
              Editar
            </Link>
          )}

          {/* Solo productos pueden eliminarse */}
          {item.type === "product" && (
            <button
              onClick={() => handleDelete(item.id, item.name)}
              className="text-sm text-red-600"
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
