const hiddenProductIds = new Set([
  "94ca3dcb-155e-4ee2-9fe3-4f0426ec86bb", // Apple Watch S10
  "1a34cc34-b26f-47f2-8f1c-f2df6dccd010", // Apple Watch Ultra 3 (base)
]);

export function isProductHidden(product: { id: string }) {
  return hiddenProductIds.has(product.id);
}
