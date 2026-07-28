"use client"

import { useRouter } from "next/navigation"
import { supabaseBrowser } from "../../lib/supabaseBrowser"

export default function AdminActions() {
    const supabase = supabaseBrowser()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/login") // o "/" si querÃ©s
    }

    return (
        <div className="flex gap-3">
            <button
                onClick={handleLogout}
                className="bg-red-600
                text-white px-4 py-2 rounded select-none"
            >
                Cerrar sesiÃ³n
            </button>

            <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500  text-white px-4 py-2 rounded select-none"
            >
                Ver sitio
            </a>
        </div>
    )
}
