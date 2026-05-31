// app/api/prices/route.ts
import { NextResponse } from "next/server";
import {
  STABLE_CURRENCIES,
  gbxCalculator,
  gbxUsdToSek,
} from "@/lib/gbx/gbxCalculator";
import { MetalPrices } from "@/components/gbx/types";

// Cache för att minska API-anrop
let cache: {
  data: any;
  timestamp: number;
} | null = null;
const CACHE_TTL = 60000; // 1 minut

async function fetchMetalPrices(): Promise<MetalPrices> {
  try {
    const response = await fetch("https://www.live-rates.com/rates", {
      next: { revalidate: 60 },
    });
    if (response.ok) {
      const data = await response.json();
      let gold = 0,
        silver = 0,
        platinum = 0;
      for (const item of data) {
        if (item.currency === "GOLD") gold = item.rate / 31.1035;
        if (item.currency === "SILVER") silver = item.rate / 31.1035;
        if (item.currency === "PLATINUM") platinum = item.rate / 31.1035;
      }
      if (gold > 0 && silver > 0 && platinum > 0) {
        return {
          gold_usd_per_gram: gold,
          platinum_usd_per_gram: platinum,
          silver_usd_per_gram: silver,
          timestamp: Date.now(),
        };
      }
    }
  } catch (error) {
    console.error("Metal API error:", error);
  }
  // Fallback-priser
  return {
    gold_usd_per_gram: 65.5,
    platinum_usd_per_gram: 29.8,
    silver_usd_per_gram: 0.82,
    timestamp: Date.now(),
  };
}

async function fetchCurrencyRates(): Promise<Record<string, number>> {
  // Returnerar USD per enhet (rätt för gbxCalculator)
  return {
    USD: 1,
    EUR: 1 / 1.08, // 0.9259
    GBP: 1 / 1.27, // 0.7874
    SEK: 1 / 10.0, // 0.1
    NOK: 1 / 9.26, // 0.108
    JPY: 1 / 157, // 0.00637
    CNY: 1 / 6.8, // 0.147
    CAD: 1 / 1.367, // 0.731
    AUD: 1 / 1.379, // 0.725
    NZD: 1 / 1.69, // 0.592
    CHF: 1 / 0.7815, // 1.279
    SGD: 1 / 1.2798, // 0.781
    KRW: 1 / 1517, // 0.000659
    DKK: 1 / 6.38, // 0.157
    PLN: 1 / 3.65, // 0.274
    CZK: 1 / 20.93, // 0.0478
    HKD: 1 / 7.78, // 0.1285
    ILS: 1 / 3.65, // 0.274
    MXN: 1 / 18.5, // 0.054
    TRY: 1 / 34.5, // 0.029
  };
}

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const [metalPrices, currencyRates] = await Promise.all([
      fetchMetalPrices(),
      fetchCurrencyRates(),
    ]);

    // Beräkna GBX-pris i USD
    const gbxPriceUSD = gbxCalculator(
      currencyRates,
      metalPrices.gold_usd_per_gram,
      metalPrices.platinum_usd_per_gram,
      metalPrices.silver_usd_per_gram,
    );

    // Hämta USD/SEK-kurs (behövs för att visa pris i SEK)
    const sekRate = currencyRates["SEK"]; // USD per SEK
    const usdToSek = 1 / sekRate; // SEK per USD
    const gbxPriceSEK = gbxUsdToSek(gbxPriceUSD, usdToSek);

    // Enkel krisstatus (kan utökas om ni vill ha samma logik som backend)
    const crisisStatus = {
      level: 0,
      message: "Normal mode",
      crashed_currencies: [],
      active_reserve_currencies: STABLE_CURRENCIES,
    };

    const response = {
      gbx: {
        value_usd: gbxPriceUSD,
        value_sek: gbxPriceSEK,
        components: {
          currency_basket_usd: 0, // kan beräknas om det behövs
          gold_component_usd: 0,
          platinum_component_usd: 0,
          silver_component_usd: 0,
        },
        crisis_mode: false,
        crisis_level: 0,
        timestamp: Date.now(),
      },
      metals: metalPrices,
      currencies: currencyRates,
      crisis: crisisStatus,
      updated_at: new Date().toISOString(),
    };

    cache = { data: response, timestamp: Date.now() };
    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 },
    );
  }
}
