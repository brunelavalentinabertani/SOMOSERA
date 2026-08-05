import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";
import { isProductHidden } from "../../../../lib/catalogVisibility";

const SEARCH_LIMIT = 6;

function normalizeSearchTerm(value: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
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
      .limit(1000);

    if (error) {
      return NextResponse.json([]);
    }

    return NextResponse.json(
      (data ?? [])
        .filter((product) => !isProductHidden(product))
        .filter((product) =>
          normalizeSearchTerm(`${product.name} ${product.category}`).includes(query),
        )
        .slice(0, SEARCH_LIMIT),
    );
  } catch {
    return NextResponse.json([]);
  }
}
