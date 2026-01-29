import { Metadata } from "next";
import RetirementPlanner from "@/components/calculators/retirement-planner";

export const metadata: Metadata = {
  title: "Retirement Planner | Practical Investment Calculators",
  description: "Plan your retirement corpus and calculate monthly savings needed. Calculate required retirement corpus based on current expenses, inflation, and investment returns.",
};

export default function RetirementPlannerPage() {
  return <RetirementPlanner />;
}
