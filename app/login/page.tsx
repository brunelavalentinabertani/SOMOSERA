import { redirect } from 'next/navigation'
import { supabaseServer } from '../../lib/supabaseServer'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
export default async function LoginPage() {
  const supabase = await supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si ya está logueado, no ve el login
  if (session) {
    redirect('/admin')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-200">
      <Card className="w-full max-w-sm bg-white border border-neutral-300 shadow-xl hover:shadow-2xl transition-shadow select-none">

        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900 select-none">
            Iphone BA - Admin
          </CardTitle>
          <p className="text-sm text-neutral-500 select-none">
            Ingresá tus credenciales
          </p>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              'use server'

              const email = formData.get('email') as string
              const password = formData.get('password') as string

              const supabase = await supabaseServer()

              const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
              })

              if (!error) {
                redirect('/admin')
              }
            }}
            className="space-y-4"
          >
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="text-neutral-900 placeholder:text-neutral-600 border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="text-neutral-900 placeholder:text-neutral-600 border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900"
            />


            <Button
              type="submit"
              className="
                w-full
                bg-neutral-900
                text-neutral-100
                hover:bg-neutral-800
                hover:brightness-110 shadow-md
                transition
              "
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
