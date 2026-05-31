// components/gbx/types.ts

export interface MetalPrices {
  gold_usd_per_gram: number;
  platinum_usd_per_gram: number;
  silver_usd_per_gram: number;
  timestamp?: number;
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
  crisis_level: number;
  timestamp: number;
}

export interface CrisisStatus {
  level: number;
  message: string;
  crashed_currencies: string[];
  active_reserve_currencies: string[];
  committee_active: boolean;
  committee_decision_pending?: boolean;
  active_base_currency: string; // <-- Lägg till denna rad
}
