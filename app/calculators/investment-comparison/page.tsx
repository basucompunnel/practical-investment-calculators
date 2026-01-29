import InvestmentComparisonCalculator from "@/components/calculators/investment-comparison";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Comparison Calculator | Equity, Gold, Debt Fund & FD Returns",
  description: "Compare returns across different investment types - Equity Funds, Gold, Debt Funds, and Fixed Deposits. Calculate and compare SIP, Step-up SIP, and Lumpsum investments with year-by-year breakdown.",
};

export default function InvestmentComparisonPage() {
  return <InvestmentComparisonCalculator />;
}
