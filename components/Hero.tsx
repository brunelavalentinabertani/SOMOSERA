"use client";

import Navbar from "../components/layout/Navbar";
import Link from "next/link";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import SearchBar from "./SearchBar";

const slides = [
    {
        id: 1,
        image: "/Iphone_HeroImage.jpeg",
        title: "iPhone 17 Pro Max",
        link: "/products/iphone-17-pro-max",
        cta: "Ver iPhone",
    },
    {
        id: 2,
        image: "/Applewatch_HeroImage.jpeg",
        title: "Apple Watch",
        link: "/products/apple-watch",
        cta: "Ver Watch",
    },
    {
        id: 3,
        image: "/AirpodsMax_HeroImage.jpeg",
        title: "AirPods Max",
        link: "/products/airpods-max",
        cta: "Ver AirPods",
    },
    {
        id: 4,
        image: "/Macbook_HeroImage.jpeg",
        title: "MacBook Pro",
        link: "/products/macbook-pro",
        cta: "Ver MacBook",
    },
];

export default function Hero() {
    const [api, setApi] = useState<CarouselApi | null>(null);

    return (
        <>
            <section className=" relative w-full h-screen overflow-hidden">

                 <Carousel opts={{ loop: true }} setApi={setApi} className="w-full h-full">
                <CarouselContent>
                    {slides.map((slide) => (
                        <CarouselItem key={slide.id}>
                            <Link href={slide.link}>

                                <div className="relative w-full h-screen">
                                    {/* IMAGEN */}
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        priority={slide.id === 1}
                                        className="object-cover"
                                    />

                                    {/* OVERLAY */}
                                    <div className="absolute inset-0 bg-black/20" />

                                    {/* TEXTO + CTA */}
                                    <div
                                        className="
                  absolute left-10 top-1/2 -translate-y-1/2
                  z-10 text-white max-w-xl
                "
                                    >
                                        <h1 className="text-4xl md:text-5xl font-bold">
                                            {slide.title}
                                        </h1>

                                        <p className="mt-4 text-lg text-gray-200">
                                            Tecnología premium con financiación exclusiva
                                        </p>


                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* FLECHAS */}
                <button
                    onClick={() => api?.scrollPrev()}
                    className="
            absolute left-6 top-1/2 z-20
            -translate-y-1/2
            text-white hover:scale-110
            transition
          "
                >
                    <ChevronLeft size={48} strokeWidth={1.5} />
                </button>

                <button
                    onClick={() => api?.scrollNext()}
                    className="
            absolute right-6 top-1/2 z-20
            -translate-y-1/2
            text-white hover:scale-110
            transition
          "
                >
                    <ChevronRight size={48} strokeWidth={1.5} />
                </button>
            </Carousel>

                {/* ===== MOBILE ===== */}
                <div className="md:hidden absolute top-4 left-4 right-4 z-30 flex items-center gap-3">

                    {/* Hamburguesa */}
                    <Navbar />

                    {/* Search */}
                    <div className="flex-1">
                        <SearchBar />
                    </div>

                </div>

                {/* ===== DESKTOP (como lo querías) ===== */}
                <div className="hidden md:block absolute top-0 left-0 z-20 w-full">
                    <Navbar />
                    <div className="absolute top-6 right-10 w-72">
                        <SearchBar />
                    </div>
                </div>

                
            </section>


          
        </>
    );
}
