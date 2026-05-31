// lib/gbx/weights.ts

/**
 * Viktning för de 20 valutorna i GBX (sammanlagd vikt = 85% av GBX)
 * Baserad på BNP-data (IMF 2024) enligt överenskommen modell:
 * - USA, Kina, Japan och Eurozonen (EUR) får 45% tillsammans.
 * - 16 andra länder (inkl. Sydafrika) får 40% tillsammans.
 * - Ädelmetaller står för resterande 15%.
 *
 * Argentina är borttagen och ersatt av Sydafrika.
 * Inga sanktionerade länder ingår.
 */
export const CURRENCY_WEIGHTS: Record<string, number> = {
  // De fyra blocken (45% totalt)
  USD: 0.1933, // USA 19.33%
  CNY: 0.1254, // Kina 12.54%
  JPY: 0.0267, // Japan 2.67%
  EUR: 0.1046, // Eurozonen 10.46%

  // De 16 andra länderna (40% totalt)
  INR: 0.0613, // Indien 6.13%
  GBP: 0.056, // Storbritannien 5.60%
  CAD: 0.0338, // Kanada 3.38%
  BRL: 0.0337, // Brasilien 3.37%
  KRW: 0.0288, // Sydkorea 2.88%
  MXN: 0.0282, // Mexiko 2.82%
  AUD: 0.0277, // Australien 2.77%
  IDR: 0.0215, // Indonesien 2.15%
  TRY: 0.0209, // Turkiet 2.09%
  SAR: 0.0192, // Saudiarabien 1.92%
  CHF: 0.0145, // Schweiz 1.45%
  PLN: 0.0106, // Polen 1.06%
  SEK: 0.0094, // Sverige 0.94%
  THB: 0.0082, // Thailand 0.82%
  NGN: 0.0068, // Nigeria 0.68%
  ZAR: 0.0062, // Sydafrika 0.62% ← NY! (ersätter ARS)
};

/**
 * Ädelmetallernas vikt i GBX (15% totalt)
 * Fördelning: Guld 7.5%, Platina 3.75%, Silver 3.75%
 */
export const METAL_WEIGHTS = {
  gold: 0.075, // 7.5%
  platinum: 0.0375, // 3.75%
  silver: 0.0375, // 3.75%
};

// Kontrollsumma (valutornas vikter bör summera till 0.85)
const sumCurrencies = Object.values(CURRENCY_WEIGHTS).reduce(
  (a, b) => a + b,
  0,
);
console.assert(
  Math.abs(sumCurrencies - 0.85) < 0.0001,
  `Valutavikter summerar till ${sumCurrencies}, förväntat 0.85`,
);

// Kontrollsumma metaller
const sumMetals =
  METAL_WEIGHTS.gold + METAL_WEIGHTS.platinum + METAL_WEIGHTS.silver;
console.assert(
  Math.abs(sumMetals - 0.15) < 0.0001,
  `Metallvikter summerar till ${sumMetals}, förväntat 0.15`,
);
