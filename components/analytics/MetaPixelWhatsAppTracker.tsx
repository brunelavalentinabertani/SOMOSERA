"use client";

import { useEffect } from "react";

type MetaPixelFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
  }
}

const WHATSAPP_SELECTOR = [
  "[data-whatsapp-track]",
  'a[href*="wa.me/"]',
  'a[href*="api.whatsapp.com/"]',
].join(",");

function inferSource(element: Element) {
  const explicitSource = (element as HTMLElement).dataset.whatsappSource;
  if (explicitSource) return explicitSource;
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  return "page";
}

export default function MetaPixelWhatsAppTracker() {
  useEffect(() => {
    const trackClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const element = event.target.closest<HTMLElement>(WHATSAPP_SELECTOR);
      if (!element || typeof window.fbq !== "function") return;

      const {
        whatsappProductId: productId,
        whatsappProductName: productName,
        whatsappBrand: brand,
        whatsappCategory: category,
        whatsappValue: rawValue,
        whatsappVariantId: variantId,
        whatsappVariantName: variantName,
      } = element.dataset;
      const value = rawValue ? Number(rawValue) : null;
      const label = element.getAttribute("aria-label") ?? element.textContent?.trim() ?? "WhatsApp";

      const parameters: Record<string, string | number | string[]> = {
        source: inferSource(element),
        page_path: window.location.pathname,
        button_label: label.slice(0, 100),
      };

      if (productId) {
        parameters.content_ids = [productId];
        parameters.content_type = "product";
      }
      if (productName) parameters.content_name = productName;
      if (brand) parameters.brand = brand;
      if (category) parameters.category = category;
      if (variantId) parameters.variant_id = variantId;
      if (variantName) parameters.variant_name = variantName;
      if (value !== null && Number.isFinite(value)) {
        parameters.value = value;
        parameters.currency = "USD";
      }

      window.fbq("trackCustom", "WhatsAppClick", parameters);
    };

    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, []);

  return null;
}
