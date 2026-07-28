import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const SETTINGS_ID = "0d76d69a-4539-4ad1-8c4c-5385582fe5bb";
const SETTINGS_FIELDS = ["usd_rate", "transfer_multiplier", "list_multiplier"] as const;
const FALLBACK_SETTINGS = {
  usd_rate: 0,
  transfer_multiplier: 1.05,
  list_multiplier: 1.55,
};

type SettingsField = (typeof SETTINGS_FIELDS)[number];
type SettingsUpdatePayload = {
  updated_at: string;
} & Partial<Record<SettingsField, number>>;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("usd_rate, transfer_multiplier, list_multiplier")
      .eq("id", SETTINGS_ID)
      .single();

    if (error) {
      return NextResponse.json(FALLBACK_SETTINGS);
    }

    return NextResponse.json({
      usd_rate: Number(data.usd_rate),
      transfer_multiplier: Number(data.transfer_multiplier),
      list_multiplier: Number(data.list_multiplier),
    });
  } catch {
    return NextResponse.json(FALLBACK_SETTINGS);
  }
}

export async function PUT(req: Request) {
  const body = await req.json() as Partial<Record<SettingsField, unknown>>;
  const updatePayload: SettingsUpdatePayload = {
    updated_at: new Date().toISOString(),
  };

  if (body.usd_rate !== undefined) updatePayload.usd_rate = Number(body.usd_rate);
  if (body.transfer_multiplier !== undefined) {
    updatePayload.transfer_multiplier = Number(body.transfer_multiplier);
  }
  if (body.list_multiplier !== undefined) {
    updatePayload.list_multiplier = Number(body.list_multiplier);
  }

  for (const key of SETTINGS_FIELDS) {
    const value = updatePayload[key];
    if (value !== undefined && (!Number.isFinite(value) || value <= 0)) {
      return NextResponse.json(
        { error: `Valor inválido para ${key}` },
        { status: 400 },
      );
    }
  }

  const { data, error } = await supabase
    .from("settings")
    .update(updatePayload)
    .eq("id", SETTINGS_ID)
    .select("usd_rate, transfer_multiplier, list_multiplier")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    usd_rate: Number(data.usd_rate),
    transfer_multiplier: Number(data.transfer_multiplier),
    list_multiplier: Number(data.list_multiplier),
  });
}
