type DiscountProduct = {
  brand: string;
  category: string;
  name: string;
};

const mediaCategories = new Set(["fotografia", "filmadoras", "drones"]);

const mediaAccessoryTerms = [
  "adaptador",
  "adapter",
  "bateria",
  "battery",
  "cargador",
  "charger",
  "control remoto",
  "control rc",
  "filtro",
  "filter",
  "flash",
  "fly more kit",
  "gimbal",
  "goggles",
  "grip",
  "helices",
  "lente",
  "lens",
  "memoria",
  "memory card",
  "mic",
  "microphone",
  "mount",
  "osmo mobile",
  "ray ban",
  "shotgun",
  "tarjeta de memoria",
  "tripode",
  "twin film",
  "wayfarer",
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function isMediaAccessory(name: string) {
  const normalizedName = ` ${normalize(name)} `;
  return mediaAccessoryTerms.some((term) => normalizedName.includes(` ${normalize(term)} `));
}

export function isDiscountEligibleProduct(product: DiscountProduct) {
  const brand = normalize(product.brand);
  const category = normalize(product.category);

  if (category === "accesorios" && (brand === "apple" || brand === "samsung")) {
    return false;
  }

  if (!mediaCategories.has(category)) return true;

  if (category === "drones") {
    return ` ${normalize(product.name)} `.includes(" drone ");
  }

  return !isMediaAccessory(product.name);
}
