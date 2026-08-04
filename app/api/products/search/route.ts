import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";
import { isProductHidden } from "../../../../lib/catalogVisibility";

const SEARCH_LIMIT = 6;

function normalizeSearchTerm(value: string | null) {
  return value?.trim().replace(/[%,]/g, "") ?? "";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = normalizeSearchTerm(searchParams.get("q"));

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, category")
      .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(SEARCH_LIMIT + 2);

    if (error) {
      return NextResponse.json([]);
    }

    return NextResponse.json((data ?? []).filter((product) => !isProductHidden(product)).slice(0, SEARCH_LIMIT));
  } catch {
    return NextResponse.json([]);
  }
}
