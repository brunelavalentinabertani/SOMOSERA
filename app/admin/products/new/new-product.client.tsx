"use client"

import { useState,useRef } from "react"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "../../../../lib/supabaseBrowser"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function ImageInput() {
    const inputRef = useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = useState("NingÃºn archivo seleccionado")

    return (
        <div className="space-y-2">
            <Label className="font-bold text-gray-800">
                Imagen
            </Label>

            <input
                ref={inputRef}
                type="file"
                name="image"
                accept="image/*"
                required
                className="hidden"
                onChange={(e) => {
                    setFileName(
                        e.target.files?.[0]?.name ?? "NingÃºn archivo seleccionado"
                    )
                }}
            />

            <div className="flex items-center gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    className=" "
                >
                    Seleccionar imagen
                </Button>

                <span className="text-sm text-gray-600 truncate max-w-[240px]">
                    {fileName}
                </span>
            </div>
        </div>
    )
}
export default function NewProductClient() {
    const supabase = supabaseBrowser()
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)

        const name = formData.get("name") as string
        const brand = formData.get("brand") as string
        const description = formData.get("description") as string
        const category = formData.get("category") as string
        const stock = Number(formData.get("stock"))
        const priceUsd = Number(formData.get("price_usd"))
        const usdRate = Number(formData.get("usd_rate"))
        const imageFile = formData.get("image") as File

        let imageUrl: string | null = null

        // Subir imagen
        if (imageFile && imageFile.size > 0) {
            const ext = imageFile.name.split(".").pop()
            const fileName = `${crypto.randomUUID()}.${ext}`

            const { error } = await supabase.storage
                .from("products")
                .upload(fileName, imageFile)

            if (error) {
                alert("Error subiendo imagen")
                setLoading(false)
                return
            }

            imageUrl = supabase.storage
                .from("products")
                .getPublicUrl(fileName).data.publicUrl
        }

        const response = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                brand,
                description,
                category,
                stock,
                price_usd: priceUsd,
                usd_rate: usdRate,
                image_url: imageUrl,
            }),
        })

        setLoading(false)

        if (!response.ok) {
            alert("Error al crear producto")
            return
        }

        router.push("/admin/products")
    }

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 rounded-[2vw] ">
            <Card className="w-full max-w-xl shadow-lg border-neutral-200 select-none">
                <CardHeader>
                    <CardTitle className="text-xl text-neutral-900">
                        Nuevo producto
                    </CardTitle>
                    <CardDescription className="text-neutral-600">
                        CompletÃ¡ la informaciÃ³n para agregar un producto al catÃ¡logo
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1 text-gray-800">
                            <Label className="font-bold">Nombre</Label>
                            <Input name="name" required />
                        </div>

                        <div className="space-y-1 text-gray-800">
                            <Label className="font-bold">Marca</Label>
                            <Input name="brand" required />
                        </div>

                        <div className="space-y-1 text-gray-800">
                            <Label className="font-bold">DescripciÃ³n</Label>
                            <Textarea name="description" rows={3} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-gray-800">
                            <div className="space-y-1">
                                <Label className="font-bold">Precio USD</Label>
                                <Input
                                    name="price_usd"
                                    type="number"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="font-bold">Valor del dÃ³lar</Label>
                                <Input
                                    name="usd_rate"
                                    type="number"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-gray-800">
                            <div className="space-y-1">
                                <Label className="font-bold">Stock</Label>
                                <Input name="stock" type="number" required />
                            </div>

                            <div className="space-y-1 ">
                                <Label className="font-bold">CategorÃ­a</Label>
                                <Input name="category" required />
                            </div>
                        </div>

                        <ImageInput />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={loading}
                                onClick={() => router.push("/admin")}
                                className=" bg-red-600"
                            >
                                Cancelar
                            </Button>

                            <Button
                                disabled={loading}
                                className=" bg-green-900 text-white hover:bg-neutral-800"
                            >
                                {loading ? "Guardando..." : "Crear producto"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
