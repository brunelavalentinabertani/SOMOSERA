import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";
import { isProductHidden } from "../../../../lib/catalogVisibility";

const SEARCH_LIMIT = 6;

function normalizeSearchTerm(value: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getSearchScore(searchableText: string, query: string) {
  const terms = Array.from(new Set(query.split(" ").filter(Boolean)));
  const matchedTerms = terms.filter((term) => searchableText.includes(term));

  if (matchedTerms.length === 0) {
    return 0;
  }

  // Keep complete phrase matches first, then favor products matching more
  // individual words from the search (for example, "nikon z50").
  return (searchableText.includes(query) ? terms.length + 1 : 0) + matchedTerms.length;
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
        .map((product) => ({
          product,
          score: getSearchScore(
            normalizeSearchTerm(`${product.name} ${product.category}`),
            query,
          ),
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, SEARCH_LIMIT)
        .map(({ product }) => product),
    );
  } catch {
    return NextResponse.json([]);
  }
}
