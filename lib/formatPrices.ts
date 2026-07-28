export function formatPrice(value: number) {
    return new Intl.NumberFormat("es-AR").format(Math.round(value))
  }
  