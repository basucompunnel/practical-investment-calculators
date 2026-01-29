import LoanAffordabilityCalculator from "@/components/calculators/affordability";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loan Affordability Calculator | Car, Home, Education, Personal & Bike Loans",
  description: "Calculate EMI, affordability, and total costs for various loan types. Comprehensive calculators for car loans, home loans, education loans, personal loans, bike loans, and phone financing with detailed amortization schedules.",
};

export default function LoanAffordabilityPage() {
  return <LoanAffordabilityCalculator />;
}
