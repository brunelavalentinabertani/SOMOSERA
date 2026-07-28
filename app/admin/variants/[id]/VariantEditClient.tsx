"use client";

import { supabaseBrowser } from "../../../../lib/supabaseBrowser";
import { useRouter } from "next/navigation";
import ProductPriceForm from "../../../../components/admin/ProductPriceForm"; 

type Variant = {
  id: string;
  price_usd: number | null;
  color_name: string | null;
  storage_gb: number | null;
  products: {
    name: string;
  } | {
    name: string;
  }[];
};

export default function VariantEditClient({ variant }: { variant: Variant }) {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const product = Array.isArray(variant.products)
    ? variant.products[0]
    : variant.products;

  const handleSave = async (price: number) => {
    const { error } = await supabase
      .from("product_variants")
      .update({ price_usd: price })
      .eq("id", variant.id);

    if (error) {
      console.error(error);
      alert("Error al guardar");
      return;
    }

    alert("Precio actualizado");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <ProductPriceForm
      title={product?.name ?? "Producto"}
      subtitle={`${variant.storage_gb}GB - ${variant.color_name}`}
      initialPrice={variant.price_usd}
      onSave={handleSave}
    />
  );
}
