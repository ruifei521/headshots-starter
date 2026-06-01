"use client"

import { Check, X, Minus } from "lucide-react"
import { TIERS, type TierInfo } from "@/lib/tiers"

/** 对比行定义 */
interface ComparisonRow {
  label: string;
  values: Record<string, string | boolean>;
}

export default function TierComparisonTable() {
  const tierList: TierInfo[] = [
    TIERS.starter,
    TIERS.professional,
    TIERS.executive,
  ];

  const rows: ComparisonRow[] = [
    {
      label: "Price",
      values: {
        starter: `$${TIERS.starter.price} (was $${TIERS.starter.originalPrice})`,
        professional: `$${TIERS.professional.price} (was $${TIERS.professional.originalPrice})`,
        executive: `$${TIERS.executive.price} (was $${TIERS.executive.originalPrice})`,
      },
    },
    {
      label: "Headshots",
      values: { starter: "40", professional: "60", executive: "100" },
    },
    {
      label: "Outfits & backgrounds",
      values: { starter: "20+", professional: "40+", executive: "80+" },
    },
    {
      label: "Resolution",
      values: { starter: "1024×1024", professional: "1024×1024", executive: "1024×1024" },
    },
    {
      label: "AI model",
      values: { starter: "Flux", professional: "Flux", executive: "Flux" },
    },
    {
      label: "Delivery",
      values: { starter: "~25 min", professional: "~25 min", executive: "~25 min" },
    },
    {
      label: "Business formal",
      values: { starter: true, professional: true, executive: true },
    },
    {
      label: "Urban outdoor",
      values: { starter: false, professional: true, executive: true },
    },
    {
      label: "Speaking / conference",
      values: { starter: false, professional: true, executive: true },
    },
    {
      label: "Legal / finance",
      values: { starter: false, professional: true, executive: true },
    },
    {
      label: "Natural lifestyle",
      values: { starter: false, professional: true, executive: true },
    },
    {
      label: "Real estate",
      values: { starter: false, professional: false, executive: true },
    },
    {
      label: "Medical / academic",
      values: { starter: false, professional: false, executive: true },
    },
    {
      label: "Creative director",
      values: { starter: false, professional: false, executive: true },
    },
    {
      label: "Commercial license",
      values: { starter: true, professional: true, executive: true },
    },
    {
      label: "30-day privacy",
      values: { starter: true, professional: true, executive: true },
    },
  ];

  function renderValue(value: string | boolean) {
    if (typeof value === "boolean") {
      if (value) {
        return <Check className="h-5 w-5 text-primary mx-auto" />;
      }
      return <Minus className="h-5 w-5 text-muted-foreground/40 mx-auto" />;
    }
    return (
      <span className="text-sm font-medium">
        {value}
      </span>
    );
  }

  return (
    <div className="mt-12 w-full max-w-4xl">
      <h3 className="text-center text-xl font-bold mb-6">Plan Comparison</h3>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold min-w-[160px]">Features</th>
              {tierList.map((tier) => (
                <th
                  key={tier.tier}
                  className={`px-4 py-3 text-center font-semibold ${
                    tier.tier === "professional" ? "text-primary" : ""
                  }`}
                >
                  <div>{tier.name}</div>
                  <div className="text-xs font-normal text-muted-foreground mt-0.5">
                    {tier.priceLabel}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={`border-b ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                <td className="px-4 py-3 font-medium">{row.label}</td>
                {tierList.map((tier) => (
                  <td
                    key={tier.tier}
                    className={`px-4 py-3 text-center ${
                      tier.tier === "professional" ? "bg-primary/5" : ""
                    }`}
                  >
                    {renderValue(row.values[tier.tier])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
