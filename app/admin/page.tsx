import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminActions from "./AdminActions.client";
import UsdRateCard from "./UsdRateClient.client";

export default function AdminPage() {
    return (
        <main className="min-h-screen bg-neutral-100 p-8">
            <div className="mx-auto max-w-5xl space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900 select-none">
                            Panel de administración
                        </h1>
                        <p className="text-sm text-neutral-700 select-none">
                            Gestión de productos y contenido
                        </p>
                    </div>

                    <AdminActions />
                </header>

                {/* Cards */}
                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Link href="/admin/products">
                        <Card className="border-neutral-200 bg-white transition hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="text-neutral-900">Productos</CardTitle>
                                <CardDescription className="text-neutral-700">
                                    Ver, editar o eliminar productos
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <Button
                                    variant="outline"
                                    className="bg-neutral-900 text-white hover:bg-neutral-800 ">

                                    Ir a productos
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/products/new">
                        <Card className="border-neutral-200 bg-white transition hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="text-neutral-900">
                                    Nuevo producto
                                </CardTitle>
                                <CardDescription className="text-neutral-700">
                                    Agregar un producto al catálogo
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <Button className="bg-neutral-900 text-white hover:bg-neutral-800 ">
                                    Crear producto
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <UsdRateCard />
                    </section>
                </section>
            </div>
        </main>
    );
}
