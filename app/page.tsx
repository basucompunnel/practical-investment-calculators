import { Metadata } from "next";
import Home from "@/components/home";

export const metadata: Metadata = {
  title: "Practical Investment Calculators - Financial Planning Tools",
  description: "Free investment calculators for goal planning, retirement planning, loan affordability, and investment comparison. Calculate SIP, lumpsum returns, EMI affordability, and more.",
};

export default function Page() {
  return <Home />;
}
