import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "../../../lib/supabaseServer";

type ProductPayload = {
  name?: unknown;
  brand?: unknown;
  description?: unknown;
  category?: unknown;
  stock?: unknown;
  price_usd?: unknown;
  usd_rate?: unknown;
  image_url?: unknown;
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function requiredString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function requiredNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function optionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export async function POST(request: Request) {
  const authClient = await supabaseServer();
  const {
    data: { session },
  } = await authClient.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as ProductPayload;
  const name = requiredString(body.name);
  const brand = requiredString(body.brand);
  const description = requiredString(body.description);
  const category = requiredString(body.category);
  const stock = requiredNumber(body.stock);
  const priceUsd = optionalNumber(body.price_usd);
  const usdRate = requiredNumber(body.usd_rate);
  const imageUrl =
    typeof body.image_url === "string" && body.image_url.trim()
      ? body.image_url.trim()
      : null;

  if (
    !name ||
    !brand ||
    !description ||
    !category ||
    stock === null ||
    usdRate === null
  ) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      name,
      brand,
      description,
      category,
      stock,
      price_usd: priceUsd,
      usd_rate: usdRate,
      image_url: imageUrl,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
