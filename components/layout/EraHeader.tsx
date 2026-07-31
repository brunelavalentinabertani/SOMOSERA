"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, MessageCircle, Search, X } from "lucide-react";

type SearchResult = {
    id: string;
    name: string;
    category: string | null;
};

const navItems = [
    { label: "Apple", href: "/products?brand=Apple" },
    { label: "Kindle", href: "/products?category=Kindle" },
    { label: "Samsung", href: "/products?brand=Samsung" },
    { label: "Xiaomi", href: "/products?brand=Xiaomi" },
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
                <div className="fixed inset-x-4 top-20 z-50 border border-era-line bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-10 sm:w-[340px]">
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="relative z-50 mx-auto flex h-[72px] max-w-[1420px] items-center justify-between px-5 sm:px-8 lg:h-[86px] lg:px-12">
            <Link href="/" aria-label="ERA home" onClick={() => setMobileMenuOpen(false)}>
                <Image
                    src="/era-logo-transparent.png"
                    alt="ERA"
                    width={1219}
                    height={367}
                    priority
                    className="h-auto w-[96px] object-contain lg:w-[116px]"
                />
            </Link>

            <nav className="hidden items-center gap-5 text-[12px] font-semibold xl:flex 2xl:gap-9 2xl:text-[13px]">
                {navItems.map((item) => (
                    <Link key={item.label} href={item.href} className="hover:text-era-blue">
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-4 lg:gap-7">
                <HeaderSearch />
                <Link
                    href="https://wa.me/5491171254322"
                    target="_blank"
                    className="hidden h-11 items-center gap-2 rounded-[4px] bg-era-black px-5 text-[13px] font-bold text-white sm:flex"
                >
                    <MessageCircle size={18} />
                    Escribinos
                </Link>
                <button
                    type="button"
                    aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={mobileMenuOpen}
                    onClick={() => setMobileMenuOpen((value) => !value)}
                    className="flex h-10 w-10 items-center justify-center xl:hidden"
                >
                    {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="absolute inset-x-0 top-full border-y border-era-line bg-white px-5 py-5 shadow-lg sm:px-8 xl:hidden">
                    <nav className="grid grid-cols-2 gap-x-6 gap-y-1 text-[14px] font-semibold sm:grid-cols-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="border-b border-era-line py-3 hover:text-era-blue"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <Link
                        href="https://wa.me/5491171254322"
                        target="_blank"
                        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-[4px] bg-era-black text-[13px] font-bold text-white sm:hidden"
                    >
                        <MessageCircle size={18} />
                        Escribinos
                    </Link>
                </div>
            )}
        </header>
    );
}
