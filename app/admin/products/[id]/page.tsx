import { supabaseServer } from "../../../../lib/supabaseServer"
import EditProductForm from "./edit-product.form"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await supabaseServer()

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !product) {
    return <p>Error cargando producto</p>
  }

  return (
    <div className="px-6 py-6 max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Editar producto</h1>

      <EditProductForm
        productId={product.id}
        productName={product.name}
        price_usd={product.price_usd}
        usd_rate={product.usd_rate}
      />
    </div>
  )
}
