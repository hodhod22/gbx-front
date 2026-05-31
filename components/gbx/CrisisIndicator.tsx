"use client";
import { useTranslation } from "react-i18next";
import { CrisisStatus } from "./types";

export default function CrisisIndicator({ crisis }: { crisis: CrisisStatus }) {
  const { t } = useTranslation();
  const levelKey = `gbx.crisis_level_${crisis.level}`;
  return (
    <div
      className={`rounded-xl p-4 mb-6 border-2 ${
        crisis.level === 0
          ? "border-green-500/50 bg-green-500/10 text-green-300"
          : crisis.level === 1
            ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-300"
            : crisis.level === 2
              ? "border-orange-500/50 bg-orange-500/10 text-orange-300"
              : "border-red-500/50 bg-red-500/10 text-red-300"
      }`}
    >
      <div className="font-bold">{t(levelKey)}</div>
      {crisis.crashed_currencies.length > 0 && (
        <div className="text-sm mt-1 opacity-90">
          Kraschade: {crisis.crashed_currencies.join(", ")}
        </div>
      )}
      {crisis.committee_active && (
        <div className="text-sm mt-2 animate-pulse">
          ⏳ Stabilitetskommittén sammanträder...
        </div>
      )}
    </div>
  );
}
