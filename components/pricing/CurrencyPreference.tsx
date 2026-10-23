"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

export type Currency = "USD" | "ARS";

type CurrencyPreferenceValue = {
  currency: Currency;
  openCurrencySelector: () => void;
};

const STORAGE_KEY = "era-preferred-currency";

const CurrencyPreferenceContext = createContext<CurrencyPreferenceValue | null>(null);

function isCurrency(value: string | null): value is Currency {
  return value === "USD" || value === "ARS";
}

export function CurrencyPreferenceProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const isPrivatePage = pathname.startsWith("/admin") || pathname.startsWith("/login");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedCurrency = window.localStorage.getItem(STORAGE_KEY);

      if (isCurrency(savedCurrency)) {
        setCurrency(savedCurrency);
      } else if (!isPrivatePage) {
        setSelectorOpen(true);
      }

      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isPrivatePage]);

  const shouldShowSelector = selectorOpen && !isPrivatePage;

  useEffect(() => {
    if (!shouldShowSelector) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldShowSelector]);

  const value = useMemo(
    () => ({ currency, openCurrencySelector: () => setSelectorOpen(true) }),
    [currency],
  );

  const selectCurrency = (nextCurrency: Currency) => {
    setCurrency(nextCurrency);
    window.localStorage.setItem(STORAGE_KEY, nextCurrency);
    setSelectorOpen(false);
  };

  return (
    <CurrencyPreferenceContext.Provider value={value}>
      {children}

      {ready && shouldShowSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-[2px] sm:px-6">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="currency-selector-title"
            aria-describedby="currency-selector-description"
            className="w-full max-w-[520px] rounded-[12px] bg-[#f7f4ef] p-6 text-center shadow-2xl sm:p-9"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-era-orange">
              Elegí cómo ver los precios
            </p>
            <h2
              id="currency-selector-title"
              className="mt-3 text-[30px] font-black leading-none tracking-[-0.04em] sm:text-[38px]"
            >
              ¿En qué moneda querés comprar?<span className="text-era-orange"> *</span>
            </h2>
            <p
              id="currency-selector-description"
              className="mx-auto mt-4 max-w-[390px] text-[14px] leading-6 text-era-text-muted"
            >
              Podés cambiar esta selección cuando quieras desde el encabezado.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => selectCurrency("USD")}
                className="flex h-14 cursor-pointer items-center justify-center rounded-[4px] border border-era-black bg-era-black px-5 text-[14px] font-bold text-white transition hover:bg-era-blue"
              >
                Ver en USD
              </button>
              <button
                type="button"
                onClick={() => selectCurrency("ARS")}
                className="flex h-14 cursor-pointer items-center justify-center rounded-[4px] border border-era-black bg-white px-5 text-[14px] font-bold text-era-black transition hover:border-era-blue hover:text-era-blue"
              >
                Ver en ARS
              </button>
            </div>
          </section>
        </div>
      )}
    </CurrencyPreferenceContext.Provider>
  );
}

export function useCurrencyPreference() {
  const context = useContext(CurrencyPreferenceContext);

  if (!context) {
    throw new Error("useCurrencyPreference must be used inside CurrencyPreferenceProvider");
  }

  return context;
}
