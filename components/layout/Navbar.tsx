"use client"

import Link from "next/link"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetHeader
} from "@/components/ui/sheet"


export default function Navbar() {
    return (
        <header className="flex items-center bg-transparent">
            <div className="relative mx-auto flex h-16 max-w-7xl items-center px-6">

                {/* Logo */}
                {/* <Link
                    href="/"
                    className="text-lg font-bold text-gray-900 tracking-tight"
                >
                    Nombre de la tienda
                </Link> */}

                {/* Links centrados (desktop / tablet) */}
                <nav className=" select-none absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
                    <Link
                        href="/"
                        className=" text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        Home
                    </Link>

                    <Link
                        href="/products"
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        Productos
                    </Link>

                    {/* <Link
                        href="/about"
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        Sobre nosotros
                    </Link> */}
                </nav>

                {/* Acciones derecha (desktop) */}
                {/* <div className="ml-auto hidden items-center gap-3 md:flex">
                    <Button
                        asChild
                        variant="outline"
                        className=" "
                    >
                        <Link href="/login">Login</Link>
                    </Button>

                    <Button
                        asChild
                        className=" bg-gray-900 text-white hover:bg-gray-800"
                    >
                        <Link href="/admin">Admin</Link>
                    </Button>
                </div> */}

                {/* Mobile menu */}
                <div className="ml-auto md:hidden z-50">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="md:hidden">Menu</button>
                        </SheetTrigger>

                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle className="sr-only">
                                    MenÃº de navegaciÃ³n
                                </SheetTitle>
                            </SheetHeader>

                            <nav className="mt-6 flex flex-col gap-4">
                                <Link href="/">Home</Link>
                                <Link href="/products">Productos</Link>
                                <Link href="/nosotros">Sobre nosotros</Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
