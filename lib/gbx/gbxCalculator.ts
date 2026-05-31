// frontend/lib/gbxCalculator.ts

// Lista över stabila valutor (används i frontend)
export const STABLE_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "SEK",
  "NOK",
  "DKK",
  "CHF",
  "JPY",
  "CNY",
  "CAD",
  "AUD",
  "NZD",
  "SGD",
  "HKD",
  "KRW",
  "ILS",
  "MXN",
  "TRY",
  "CZK",
  "PLN",
];

// Viktprocent för valutor (summa = 80 %)
export const CURRENCY_WEIGHTS: Record<string, number> = {
  USD: 10,
  EUR: 10,
  GBP: 10,
  SEK: 5,
  NOK: 5,
  DKK: 2,
  CHF: 5,
  JPY: 5,
  CNY: 5,
  CAD: 5,
  AUD: 5,
  NZD: 5,
  SGD: 5,
  HKD: 2,
  KRW: 1,
  ILS: 2,
  MXN: 2,
  TRY: 2,
  CZK: 2,
  PLN: 2,
};

// Viktprocent för ädelmetaller (summa = 15 %)
export const METAL_WEIGHTS = {
  gold: 7.5,
  platinum: 3.5,
  silver: 3.5,
};

export interface CrisisStatus {
  level: 0 | 1 | 2 | 3;
  message: string;
  crashed: string[];
}

/**
 * Beräknar aktuellt GBX‑pris i USD baserat på valutakurser och metallpriser.
 * @param currencyRates - kurser i USD per enhet (t.ex. { SEK: 0.096 })
 * @param goldPrice - pris för guld (USD/gram)
 * @param platinumPrice - pris för platina (USD/gram)
 * @param silverPrice - pris för silver (USD/gram)
 * @returns GBX‑pris i USD
 */
export function gbxCalculator(
  currencyRates: Record<string, number>,
  goldPrice: number,
  platinumPrice: number,
  silverPrice: number,
): number {
  let basketValue = 0;
  for (const [code, weight] of Object.entries(CURRENCY_WEIGHTS)) {
    const rate = currencyRates[code];
    if (rate && rate > 0) basketValue += rate * weight;
  }

  const metalValue =
    METAL_WEIGHTS.gold * goldPrice +
    METAL_WEIGHTS.platinum * platinumPrice +
    METAL_WEIGHTS.silver * silverPrice * 5;

  return (basketValue + metalValue) / 100;
}

/**
 * Konverterar GBX‑pris från USD till SEK.
 * @param gbxUsd - GBX‑pris i USD
 * @param sekPerUsd - växelkurs SEK per 1 USD (t.ex. 10.5)
 * @returns GBX‑pris i SEK
 */
export function gbxUsdToSek(gbxUsd: number, sekPerUsd: number): number {
  return gbxUsd * sekPerUsd;
}

/**
 * Returnerar en förenklad krisstatus (används i frontend).
 */
export function getCrisisStatus(): CrisisStatus {
  // Här kan ni senare lägga in riktig logik som matchar backend
  return { level: 0, message: "Normal mode", crashed: [] };
}
