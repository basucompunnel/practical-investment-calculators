"use client";

import { useState } from "react";
import { TabSelector } from "@/components/common/TabSelector";

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

const LOAN_TYPE_OPTIONS = [
  { value: "car", label: "Car" },
  { value: "home", label: "Home" },
  { value: "phone", label: "Phone" },
  { value: "vacation", label: "Vacation" },
];

export default function LoanAffordabilityCalculator() {
  const [selectedType, setSelectedType] = useState<LoanType>("car");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Loan Affordability Calculator</h1>
      
      {/* Loan Type Tabs */}
      <div className="mb-8">
        <TabSelector
          options={LOAN_TYPE_OPTIONS}
          selected={selectedType}
          onChange={(value) => setSelectedType(value as LoanType)}
          columns={4}
        />
      </div>

      <p className="text-muted-foreground mb-8 text-lg">
        {loanTypeInfo[selectedType].description}
      </p>

      <div className="text-muted-foreground">
        Coming soon...
      </div>
    </div>
  );
}
