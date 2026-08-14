/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    // Supabase ya entrega las imágenes públicas. Evitamos depender de la
    // cuota de Image Optimization de Vercel en producción.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zomiozxppjolsmjvaxbv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
}

module.exports = nextConfig
