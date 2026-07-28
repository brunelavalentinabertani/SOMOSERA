"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle, Search } from "lucide-react";

type SearchResult = {
    id: string;
    name: string;
    category: string | null;
};

const navItems = [
    { label: "Apple", href: "/products?brand=Apple" },
    { label: "Kindle", href: "/products?category=Kindle" },
    { label: "Samsung", href: "/products?brand=Samsung" },
    { label: "Xiaomi", href: "/products?brand=Xiaomi&category=Celulares" },
    { label: "Motorola", href: "/products?brand=Motorola&category=Celulares" },
    { label: "Foto/Video", href: "/products?category=Fotografia" },
    { label: "Gaming", href: "/products?category=Gaming" },
    { label: "Nosotros", href: "/nosotros" },
];

function HeaderSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            setResults([]);
            setLoading(false);
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);

            try {
                const response = await fetch(`/api/products/search?q=${encodeURIComponent(trimmedQuery)}`);
                if (!response.ok) {
                    setResults([]);
                    return;
                }

                const data = (await response.json()) as SearchResult[];
                setResults(data);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 250);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="relative">
            <button
                type="button"
                aria-label="Buscar productos"
                onClick={() => setOpen((value) => !value)}
                className=" "
            >
                <Search size={24} strokeWidth={1.8} />
            </button>

            {open && (
                <div className="absolute right-0 top-10 z-50 w-[340px] border border-era-line bg-white shadow-xl">
                    <div className="relative">
                        <Search
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-era-text-muted"
                        />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Buscar productos..."
                            value={query}
                            onChange={(event) => {
                                const nextQuery = event.target.value;
                                setQuery(nextQuery);

                                if (!nextQuery.trim()) {
                                    setResults([]);
                                    setLoading(false);
                                }
                            }}
                            className="h-12 w-full border-b border-era-line bg-white pl-11 pr-4 text-[13px] outline-none"
                        />
                    </div>

                    {query && (
                        <div className="max-h-[270px] overflow-y-auto">
                            {loading && (
                                <p className="px-4 py-3 text-[13px] text-era-text-muted">
                                    Buscando...
                                </p>
                            )}

                            {!loading && results.length === 0 && (
                                <p className="px-4 py-3 text-[13px] text-era-text-muted">
                                    No se encontraron resultados
                                </p>
                            )}

                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    onClick={() => setOpen(false)}
                                    className="block border-b border-era-line px-4 py-3 text-[13px] transition hover:bg-era-white"
                                >
                                    <span className="font-bold text-era-black">{product.name}</span>
                                    {product.category && (
                                        <span className="ml-2 text-era-text-muted">
                                            {product.category}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function EraHeader() {
    return (
        <header className="mx-auto flex h-[86px] max-w-[1420px] items-center justify-between px-12">
            <Link href="/" aria-label="ERA home">
                <Image
                    src="/era-logo-transparent.png"
                    alt="ERA"
                    width={1219}
                    height={367}
                    priority
                    className="h-auto w-[116px] object-contain"
                />
            </Link>

            <nav className="flex items-center gap-9 text-[13px] font-semibold">
                {navItems.map((item) => (
                    <Link key={item.label} href={item.href} className="hover:text-era-blue">
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-7">
                <HeaderSearch />
                <Link
                    href="https://wa.me/5491171254322"
                    target="_blank"
                    className="flex h-11 items-center gap-2 rounded-[4px] bg-era-black px-5 text-[13px] font-bold text-white"
                >
                    <MessageCircle size={18} />
                    Escribinos
                </Link>
            </div>
        </header>
    );
}
