import { redirect } from "next/navigation";
import { supabaseServer } from "../../../../lib/supabaseServer"
import NewProductClient from "./new-product.client"

export default async function AdminPage() {
    const supabase = await supabaseServer();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <main className="p-10 space-y-10 bg-gray-300">
            <h1 className="text-3xl font-bold select-none text-black">Admin Panel - Iphone BA</h1>

            <NewProductClient />
        </main>
    );
}
