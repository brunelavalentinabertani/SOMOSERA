export function getWarranty(brand?: string | null) {
  return brand?.trim().toLowerCase() === "apple"
    ? { title: "Garantía Apple Oficial", text: "12 meses de garantía oficial" }
    : { title: "Garantía de 3 meses", text: "Con nosotros mismos" };
}
