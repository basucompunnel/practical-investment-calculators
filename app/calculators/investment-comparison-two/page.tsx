import InvestmentComparisonTwo from "@/components/calculators/investment-comparison-two";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment Comparison Calculator | Compare SIP, Step-up SIP & Lumpsum",
  description: "Compare different investment strategies side-by-side. Calculate returns for SIP, Step-up SIP, and Lumpsum investments with detailed year-by-year analysis and inflation-adjusted values.",
};

export default function InvestmentComparisonTwoPage() {
  return <InvestmentComparisonTwo />;
}
