import type { Metadata } from "next";
import GoalPlannerCalculator from "@/components/calculators/goal-planner";

export const metadata: Metadata = {
  title: "Goal-based Investment Planner | Practical Investment Calculators",
  description: "Plan your financial goals with our goal-based investment calculator. Calculate required monthly SIP, step-up SIP, or lumpsum investment to achieve your target amount, or determine how long it will take with your current investment plan across equity, gold, debt, and fixed deposits.",
};

export default function GoalPlannerPage() {
  return <GoalPlannerCalculator />;
}
