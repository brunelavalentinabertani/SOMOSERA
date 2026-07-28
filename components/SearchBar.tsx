"use client"

import { Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Product = {
    id: number
    name: string
    category: string
}

export default function SearchBar() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const trimmedQuery = query.trim()

        if (!trimmedQuery) {
            setResults([])
            setLoading(false)
            return
        }

        const fetchResults = async () => {
            setLoading(true)

            try {
                const response = await fetch(`/api/products/search?q=${encodeURIComponent(trimmedQuery)}`)
                if (!response.ok) {
                    setResults([])
                    return
                }

                const data = (await response.json()) as Product[]
                setResults(data)
            } catch {
                setResults([])
            } finally {
                setLoading(false)
            }
        }

        const timeout = setTimeout(fetchResults, 300)
        return () => clearTimeout(timeout)
    }, [query])

    return (
        <div className="absolute top-4 right-6  w-80">
            {/* INPUT */}
            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={query}
                    onChange={(e) => {
                        const nextQuery = e.target.value
                        setQuery(nextQuery)

                        if (!nextQuery.trim()) {
                            setResults([])
                            setLoading(false)
                        }
                    }}
                    className="
            w-full pl-10 pr-4 py-2
            rounded-full
            bg-white/90 backdrop-blur
            text-sm
            focus:outline-none
          "
                />
            </div>

            {/* RESULTADOS */}
            {query && (
                <div className="mt-2 rounded-xl bg-white shadow-lg overflow-hidden">
                    {loading && (
                        <div className="px-4 py-2 text-sm text-gray-500">
                            Buscando...
                        </div>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="px-4 py-2 text-sm text-gray-500">
                            No se encontraron resultados
                        </div>
                    )}

                    {results.map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="
                block px-4 py-2 text-sm
                hover:bg-gray-100
              "
                        >
                            <span className="font-medium">{product.name}</span>
                            <span className="ml-2 text-gray-500">
                                {product.category}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
