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
      label: "价格",
      values: {
        starter: "$29",
        professional: "$39",
        executive: "$59",
      },
    },
    {
      label: "出图数量",
      values: {
        starter: "40 张",
        professional: "60 张",
        executive: "100 张",
      },
    },
    {
      label: "风格场景",
      values: {
        starter: "10 种",
        professional: "15 种",
        executive: "25 种",
      },
    },
    {
      label: "分辨率",
      values: {
        starter: "512×768",
        professional: "512×768",
        executive: "1024×1024",
      },
    },
    {
      label: "AI 模型",
      values: {
        starter: "SD 1.5",
        professional: "SD 1.5",
        executive: "Flux (增强)",
      },
    },
    {
      label: "交付时间",
      values: {
        starter: "~45 分钟",
        professional: "~40 分钟",
        executive: "~25 分钟",
      },
    },
    {
      label: "商务正装风格",
      values: {
        starter: true,
        professional: true,
        executive: true,
      },
    },
    {
      label: "都市户外风格",
      values: {
        starter: false,
        professional: true,
        executive: true,
      },
    },
    {
      label: "演讲/会议风格",
      values: {
        starter: false,
        professional: true,
        executive: true,
      },
    },
    {
      label: "法律/金融风格",
      values: {
        starter: false,
        professional: true,
        executive: true,
      },
    },
    {
      label: "自然生活风格",
      values: {
        starter: false,
        professional: true,
        executive: true,
      },
    },
    {
      label: "房产经纪风格",
      values: {
        starter: false,
        professional: false,
        executive: true,
      },
    },
    {
      label: "医疗/学术风格",
      values: {
        starter: false,
        professional: false,
        executive: true,
      },
    },
    {
      label: "创意总监风格",
      values: {
        starter: false,
        professional: false,
        executive: true,
      },
    },
    {
      label: "商业授权",
      values: {
        starter: true,
        professional: true,
        executive: true,
      },
    },
    {
      label: "30天隐私保护",
      values: {
        starter: true,
        professional: true,
        executive: true,
      },
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
