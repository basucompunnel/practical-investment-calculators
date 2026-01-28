import EMISplitCalculator from "@/components/calculators/emi-split";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EMI Split Calculator - Rent vs Own Pocket Payment",
  description: "Calculate how much of your property EMI is covered by rental income vs your own pocket. Track break-even point and visualize payment split over loan tenure.",
};

export default function Page() {
  return <EMISplitCalculator />;
}
