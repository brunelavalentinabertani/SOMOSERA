"use client";

import { supabaseBrowser } from "../../../../lib/supabaseBrowser";
import { useRouter } from "next/navigation";
import ProductPriceForm from "../../../../components/admin/ProductPriceForm";

type Props = {
  productId: string;
  productName: string;
  price_usd: number;
  usd_rate: number;
};

export default function EditProductForm({
  productId,
  productName,
  price_usd,
  usd_rate,
}: Props) {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const handleSave = async (price: number, usdRate?: number) => {
    const { error } = await supabase
      .from("products")
      .update({
        price_usd: price,
        usd_rate: usdRate,
      })
      .eq("id", productId);

    if (error) {
      console.error(error);
      alert("Error al guardar cambios");
      return;
    }

    alert("Producto actualizado correctamente ✅");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <ProductPriceForm
      title={productName}
      initialPrice={price_usd}
      initialUsdRate={usd_rate}
      showUsdRate={true}
      onSave={handleSave}
    />
  );
}
