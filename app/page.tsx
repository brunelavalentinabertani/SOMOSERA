import EraHome from "../components/home/EraHome"
import type { Metadata } from "next"
import { supabase } from "../lib/supabaseClient"

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const launchProductIds = [
  "862cddaa-2cee-46e5-acb3-f4430398b881",
  "b5f44730-049b-49ce-8e84-f54ff5169d52",
];

export default async function Home() {
  const { data } = await supabase
    .from("products")
    .select("id,name,price_usd")
    .in("id", launchProductIds);

  return (
    <>
      <EraHome launchProducts={data ?? []} />
    </>
  )
}
