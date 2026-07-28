"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CarouselApi } from "@/components/ui/carousel";
import { useState } from "react";
import Image from "next/image";

type Product = {
    id: number;
    name: string;
    image_url?: string | null;
    price_usd?: number | null;
};

export default function FeaturedProducts({
    products,
}: {
    products: Product[];
}) {
    const [api, setApi] = useState<CarouselApi | null>(null);

    return (
        <section className="mt-20 px-6 pb-50">
            {/* HEADER */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900">Destacados</h2>
                <div className="mt-2 h-[1px] w-32 bg-gray-300" />
            </div>

            <div className="relative">
                <Carousel opts={{ loop: true }} setApi={setApi}>
                    <CarouselContent>
                        {products.map((product) => (
                            <CarouselItem
                                key={product.id}
                                className="basis-1/2 sm:basis-1/3 lg:basis-1/5"
                            >
                                <div
                                    className="
    bg-white
    rounded-xl
    shadow-sm
    hover:shadow-md
    transition
    p-4
    h-full
    flex
    flex-col
  "
                                >
                                    <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                fill
                                                className="object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                                Sin imagen
                                            </div>
                                        )}
                                    </div>

                                    {/* INFO (EMPUJA EL PRECIO ABAJO) */}
                                    <div className="flex-1">
                                        <h3 className="mt-4 text-sm font-medium text-gray-900">
                                            {product.name}
                                        </h3>
                                    </div>

                                    {/* PRECIO (SIEMPRE EXISTE) */}
                                    <p className="mt-1 text-sm text-gray-500 min-h-[20px]">
                                        {product.price_usd ? `USD ${product.price_usd}` : "CONSULTAR"}
                                    </p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* FLECHAS */}
                <button
                    onClick={() => api?.scrollPrev()}
                    className="
            absolute -left-6 top-1/2 -translate-y-1/2
            text-gray-800
            hover:text-black transition
          "
                >
                    <ChevronLeft size={32} />
                </button>

                <button
                    onClick={() => api?.scrollNext()}
                    className="
            absolute -right-6 top-1/2 -translate-y-1/2
            text-gray-800
            hover:text-black transition
          "
                >
                    <ChevronRight size={32} />
                </button>
            </div>
        </section>
    );
}
