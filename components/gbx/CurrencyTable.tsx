"use client";
import { useTranslation } from "react-i18next";

const STABLE_CURRENCIES = [
  "CHF",
  "SGD",
  "USD",
  "EUR",
  "JPY",
  "NOK",
  "SEK",
  "DKK",
  "CAD",
  "AUD",
  "NZD",
  "GBP",
  "KRW",
  "ILS",
  "CNY",
  "TWD",
  "HKD",
  "CZK",
  "PLN",
  "AED",
];
const CURRENCY_NAMES: Record<string, string> = {
  CHF: "Schweizisk franc",
  SGD: "Singaporisk dollar",
  USD: "USA-dollar",
  EUR: "Euro",
  JPY: "Japansk yen",
  NOK: "Norsk krona",
  SEK: "Svensk krona",
  DKK: "Dansk krona",
  CAD: "Kanadensisk dollar",
  AUD: "Australisk dollar",
  NZD: "Nyzeeländsk dollar",
  GBP: "Brittiskt pund",
  KRW: "Sydkoreansk won",
  ILS: "Israelisk shekel",
  CNY: "Kinesisk yuan",
  TWD: "Taiwanesisk dollar",
  HKD: "Hongkongdollar",
  CZK: "Tjeckisk krona",
  PLN: "Polsk zloty",
  AED: "Emiratisk dirham",
};

export default function CurrencyTable({
  currencies,
}: {
  currencies: Record<string, number>;
}) {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700 shadow-lg">
      <h3 className="text-xl font-semibold text-yellow-400 mb-4">
        💱 {t("gbx.currencyBasket")} (20 valutor)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="text-left py-2 text-gray-300">
                {t("gbx.currency")}
              </th>
              <th className="text-left py-2 text-gray-300">Kod</th>
              <th className="text-right py-2 text-gray-300">{t("gbx.rate")}</th>
              <th className="text-right py-2 text-gray-300">
                {t("gbx.weight")}
              </th>
            </tr>
          </thead>
          <tbody>
            {STABLE_CURRENCIES.map((code) => (
              <tr key={code} className="border-b border-gray-700/50">
                <td className="py-2 text-gray-200">
                  {CURRENCY_NAMES[code] || code}
                </td>
                <td className="py-2 font-mono text-yellow-400">{code}</td>
                <td className="py-2 text-right font-mono text-gray-200">
                  {currencies[code]?.toFixed(4) || "—"}
                </td>
                <td className="py-2 text-right text-gray-400">2%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
