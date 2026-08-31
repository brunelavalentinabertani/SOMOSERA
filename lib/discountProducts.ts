const discountProducts = [
  { brand: "Canon", name: "EOS R1 BODY" },
  { brand: "Canon", name: "EOS R6 MARK III KIT 24-105 F/4 USM" },
  { brand: "Nikon", name: "Z8 KIT 24-120 MM F/4 S" },
  { brand: "Canon", name: "EOS 5D MARK IV BODY" },
  { brand: "Panasonic", name: "PANASONIC HC X1200 4K HDMI 24X" },
  { brand: "Nikon", name: "Z8 BODY" },
  { brand: "Canon", name: "CANON HF G70 VIXIA UHD 4K CAMCORDER" },
  { brand: "Nikon", name: "NIKON ZR 6K CINEMA" },
  { brand: "Panasonic", name: "PANASONIC HC-V900 HD CAMCORDER" },
  { brand: "Panasonic", name: "PANASONIC HC-X2100 4K UHD" },
  { brand: "Panasonic", name: "PANASONIC HC-VX3 UHD 4K CAMCORDER" },
  { brand: "Canon", name: "EOS R5 C CINEMA" },
  { brand: "Panasonic", name: "PANASONIC AG-CX350 4K" },
  { brand: "Canon", name: "EOS R6 MARK III BODY CAJA DE KIT" },
  { brand: "DJI", name: "DRONE DJI AVATA PRO VIEW" },
  { brand: "DJI", name: "DRONE DJI MINI 5 PRO 4 BATT" },
  { brand: "Antigravity", name: "DRONE ANTIGRAVITY A1 EXPLORER 8K 360 BUNDLE" },
  { brand: "Nikon", name: "Z30 KIT 16-50 + 50-250 MM" },
  { brand: "Nikon", name: "Z6 II BODY" },
  { brand: "Sony", name: "ALFA 1 II BODY" },
  { brand: "Sony", name: "ALFA 7C II KIT 28-60" },
  { brand: "Sony", name: "FX6 V" },
  { brand: "Nikon", name: "Z30 KIT 18-140 MM VR" },
  { brand: "Nikon", name: "Z50 II KIT 16-50 + 50-250" },
  { brand: "Nikon", name: "Z7 II BODY" },
  { brand: "Panasonic", name: "PANASONIC AG-CX20 4K" },
  { brand: "Sony", name: "ALFA 7R IV BODY BLACK" },
  { brand: "Sony", name: "ZVE10 II KIT 16-50/55-210 BLACK" },
] as const;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function productKey(product: { brand: string; name: string }) {
  return `${normalize(product.brand)}::${normalize(product.name)}`;
}

const discountProductKeys = new Set(discountProducts.map(productKey));
const discountProductOrder = new Map(
  discountProducts.map((product, index) => [productKey(product), index]),
);

export function isDiscountEligibleProduct(product: { brand: string; name: string }) {
  return discountProductKeys.has(productKey(product));
}

export function getDiscountProductOrder(product: { brand: string; name: string }) {
  return discountProductOrder.get(productKey(product)) ?? Number.MAX_SAFE_INTEGER;
}
