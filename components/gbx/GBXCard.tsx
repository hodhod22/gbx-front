"use client";
import { useTranslation } from "react-i18next";
import { GBXPrice, CrisisStatus } from "./types";

interface Props {
  gbx: GBXPrice;
  crisis: CrisisStatus;
}

export default function GBXCard({ gbx, crisis }: Props) {
  const { t } = useTranslation();
  return (
    <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-yellow-500/30 shadow-2xl">
      <div className="text-center">
        <div className="text-6xl font-bold text-yellow-400 mb-2">
          ${gbx.value_usd.toFixed(4)}
        </div>
        <div className="text-gray-300 text-lg mb-4">
          {t("gbx.value", { value: gbx.value_usd.toFixed(4) })}
          {crisis.active_base_currency !== "USD" && (
            <span className="ml-2 text-yellow-400">
              (bas: {crisis.active_base_currency})
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
          <div>
            <div className="text-gray-400 text-sm">
              💱 {t("gbx.currencyBasket")}
            </div>
            <div className="text-white font-semibold">
              ${gbx.components.currency_basket_usd.toFixed(4)}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">🥇 {t("gbx.gold")}</div>
            <div className="text-white font-semibold">
              ${gbx.components.gold_component_usd.toFixed(4)}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">🔘 {t("gbx.platinum")}</div>
            <div className="text-white font-semibold">
              ${gbx.components.platinum_component_usd.toFixed(4)}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">⚪ {t("gbx.silver")}</div>
            <div className="text-white font-semibold">
              ${gbx.components.silver_component_usd.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
