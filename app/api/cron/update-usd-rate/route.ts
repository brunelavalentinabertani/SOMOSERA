import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const DOLAR_BLUE_API_URL = "https://dolarapi.com/v1/dolares/blue";
const SETTINGS_ID = "0d76d69a-4539-4ad1-8c4c-5385582fe5bb";

type DolarBlueResponse = {
  casa?: string;
  nombre?: string;
  venta?: number;
  fechaActualizacion?: string;
};

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(DOLAR_BLUE_API_URL, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`Dólar API respondió con estado ${response.status}`);
    }

    const quote = (await response.json()) as DolarBlueResponse;
    const usdRate = Number(quote.venta);

    if (quote.casa !== "blue" || !Number.isFinite(usdRate) || usdRate <= 0) {
      throw new Error("La API devolvió una cotización blue inválida");
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const updatedAt = new Date().toISOString();
    const { error } = await supabase
      .from("settings")
      .update({ usd_rate: usdRate, updated_at: updatedAt })
      .eq("id", SETTINGS_ID);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      ok: true,
      source: "DolarHoy",
      usd_rate: usdRate,
      quote_updated_at: quote.fechaActualizacion ?? null,
      updated_at: updatedAt,
    });
  } catch (error) {
    console.error("No se pudo actualizar el USD rate", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el USD rate" },
      { status: 502 },
    );
  }
}
