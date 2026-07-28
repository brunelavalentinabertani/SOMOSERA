import { supabase } from '../lib/supabaseClient'
import EraHome from "../components/home/EraHome"

export default async function Home() {

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq("Featured", true)
    .order('created_at', { ascending: false })

  return (
    <>
      <EraHome products={products ?? []} />
    </>
  )
}
