"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type LoanType = "car" | "home" | "phone" | "vacation";

const loanTypeInfo = {
  car: {
    title: "Car Loan Affordability",
    description: "Calculate how much car you can afford based on your income",
  },
  home: {
    title: "Home Loan Affordability",
    description: "Calculate how much home you can afford based on your income",
  },
  phone: {
    title: "Phone Loan Affordability",
    description: "Calculate how much phone you can afford based on your income",
  },
  vacation: {
    title: "Vacation Loan Affordability",
    description: "Calculate how much vacation you can afford to finance",
  },
};

export default function LoanAffordabilityCalculator() {
  const [selectedType, setSelectedType] = useState<LoanType>("car");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Loan Affordability Calculator</h1>
      
      {/* Loan Type Tabs */}
      <Card className="rounded-none mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.keys(loanTypeInfo) as LoanType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 rounded-none text-base font-medium transition-colors ${
                  selectedType === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-muted-foreground mb-8 text-lg">
        {loanTypeInfo[selectedType].description}
      </p>

      <div className="text-muted-foreground">
        Coming soon...
      </div>
    </div>
  );
}
