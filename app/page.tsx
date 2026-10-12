import EraHome from "../components/home/EraHome"
import type { Metadata } from "next"
import { supabase } from "../lib/supabaseClient"

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const launchProductIds = [
  "465d166e-e94b-4367-80e2-37a56326aa2f",
  "57311d13-6db5-41b1-9790-abf82d979ed4",
];

export default async function Home() {
  const { data } = await supabase
    .from("products")
    .select("id,name,price_usd,image_url")
    .in("id", launchProductIds);

  return (
    <>
      <EraHome launchProducts={data ?? []} />
    </>
  )
}
