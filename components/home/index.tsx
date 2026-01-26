import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MdSplitscreen,
  MdCompareArrows,
  MdCalculate,
  MdQuestionMark,
  MdTrendingDown,
  MdBarChart,
  MdTrackChanges,
} from "react-icons/md";
import { FaHome, FaCar } from "react-icons/fa";
import { IconType } from "react-icons";

interface Calculator {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  href: string;
}

function CalculatorCard({ calculator }: { calculator: Calculator }) {
  const Icon = calculator.icon;

  return (
    <Link href={calculator.href}>
      <Card
        key={calculator.id}
        className="group relative h-full cursor-pointer overflow-hidden rounded-none transition-all hover:bg-primary hover:shadow-lg"
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <CardHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 transition-colors group-hover:bg-primary-foreground/10">
            <Icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
          </div>
          <CardTitle className="text-xl transition-colors group-hover:text-primary-foreground">{calculator.title}</CardTitle>
          <CardDescription className="transition-colors group-hover:text-primary-foreground/80">{calculator.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

const calculators = [
  {
    id: "emi-split",
    title: "EMI Split Calculator",
    description: "Calculate EMI paid by rent vs own pocket",
    icon: MdSplitscreen,
    href: "/calculators/emi-split",
  },
  {
    id: "rent-vs-buy",
    title: "Rent vs Buy Calculator",
    description: "Find the break-even point between renting and buying",
    icon: MdCompareArrows,
    href: "/calculators/rent-vs-buy",
  },
  {
    id: "loan-affordability",
    title: "Affordability Calculator",
    description:
      "Calculate affordability for car, phone, home, or personal loans",
    icon: MdCalculate,
    href: "/calculators/affordability",
  },
  {
    id: "investment-comparison",
    title: "Investment Comparison",
    description: "Compare returns across equity, debt, gold, FD, and more",
    icon: MdBarChart,
    href: "/calculators/investment-comparison",
  },
  {
    id: "goal-planner",
    title: "Goal-based Planner",
    description: "Calculate how much to invest to reach your financial goal",
    icon: MdTrackChanges,
    href: "/calculators/goal-planner",
  },
  {
    id: "tbd-3",
    title: "Calculator 6",
    description: "Yet to be decided",
    icon: MdQuestionMark,
    href: "#",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Investment Calculators
        </h2>
        <p className="text-muted-foreground">
          Choose a calculator to get started
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calculator) => (
          <CalculatorCard key={calculator.id} calculator={calculator} />
        ))}
      </div>
    </main>
  );
}
