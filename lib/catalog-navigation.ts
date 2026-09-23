// Shared by the storefront header and the WhatsApp catalog menu.
export const catalogNavigation = [
  { id: "apple", label: "Apple", href: "/products?brand=Apple", filters: { brand: "Apple" } },
  { id: "kindle", label: "Kindle", href: "/products?category=Kindle", filters: { category: "Kindle" } },
  { id: "samsung", label: "Samsung", href: "/products?brand=Samsung", filters: { brand: "Samsung" } },
  { id: "xiaomi", label: "Xiaomi", href: "/products?brand=Xiaomi", filters: { brand: "Xiaomi" } },
  { id: "motorola", label: "Motorola", href: "/products?brand=Motorola&category=Celulares", filters: { brand: "Motorola", category: "Celulares" } },
  { id: "foto-video", label: "Foto/Video", href: "/products?category=Foto%2FVideo", filters: { category: "Foto/Video" } },
  { id: "gaming", label: "Gaming", href: "/products?category=Gaming", filters: { category: "Gaming" } },
] as const;
