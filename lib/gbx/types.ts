// lib/types.ts
export interface MetalPrices {
  gold_usd_per_gram: number;
  platinum_usd_per_gram: number;
  silver_usd_per_gram: number;
  timestamp: number;
}

export interface CurrencyRate {
  code: string;
  name: string;
  rate_usd: number;
  stable: boolean;
  volatility_30d?: number;
}

export interface GBXPrice {
  value_usd: number;
  components: {
    currency_basket_usd: number;
    gold_component_usd: number;
    platinum_component_usd: number;
    silver_component_usd: number;
  };
  active_base_currency: string;
  crisis_mode: boolean;
  crisis_level: 0 | 1 | 2 | 3 | 4;
  timestamp: number;
}

export interface CrisisStatus {
  level: 0 | 1 | 2 | 3 | 4;
  message: string;
  crashed_currencies: string[];
  active_reserve_currencies: string[];
  committee_active: boolean;
  committee_decision_pending?: boolean;
}
