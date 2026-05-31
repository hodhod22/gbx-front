"use client";
import { useTranslation } from "react-i18next";
import { MetalPrices } from "./types";

export default function MetalsCard({ metals }: { metals: MetalPrices }) {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700 shadow-lg">
      <h3 className="text-xl font-semibold text-yellow-400 mb-4">
        🥇 {t("gbx.metals")}
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-200">{t("gbx.gold")} (1g • 20%)</span>
          <span className="font-mono text-yellow-300">
            ${metals.gold_usd_per_gram.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-200">{t("gbx.platinum")} (1g • 20%)</span>
          <span className="font-mono text-blue-300">
            ${metals.platinum_usd_per_gram.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-200">{t("gbx.silver")} (5g • 20%)</span>
          <span className="font-mono text-gray-200">
            ${(metals.silver_usd_per_gram * 5).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
