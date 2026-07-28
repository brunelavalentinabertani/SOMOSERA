import { supabaseServer } from "../../../../lib/supabaseServer";
import VariantEditClient from "./VariantEditClient";

export default async function VariantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // 👈 IMPORTANTE

  const supabase = await supabaseServer();

  const { data: variant, error } = await supabase
    .from("product_variants")
    .select(`
      id,
      price_usd,
      color_name,
      storage_gb,
      products (
        id,
        name
      )
    `)
    .eq("id", id) // 👈 usar id ya resuelto
    .single();

  if (error || !variant) {
    console.error(error);
    return <div>No se encontró la variante</div>;
  }

  return <VariantEditClient variant={variant} />;
}
