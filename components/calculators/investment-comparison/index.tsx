"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HorizontalBarChart } from "@/components/common/HorizontalBarChart";
import { InvestmentType, ComparisonResults } from "./types";
import { EXPECTED_RETURNS } from "./constants";
import { formatCurrency, calculateInvestment } from "./utils";
import { InvestmentTypeSelector } from "./InvestmentTypeSelector";
import { InvestmentDetailsForm } from "./InvestmentDetailsForm";
import { ExpectedReturnsForm } from "./ExpectedReturnsForm";
import { ResultsSummaryCards } from "./ResultsSummaryCards";
import { YearlyComparisonTable } from "./YearlyComparisonTable";

export default function InvestmentComparisonCalculator() {
  const [selectedType, setSelectedType] = useState<InvestmentType>("sip");

  // Common fields
  const [tenure, setTenure] = useState<string>("10");

  // SIP & Step-up SIP fields
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>("10000");
  const [stepUpPercent, setStepUpPercent] = useState<string>("10");

  // Lumpsum field
  const [lumpsumAmount, setLumpsumAmount] = useState<string>("100000");

  // Expected returns for each investment type
  const [equityReturn, setEquityReturn] = useState<string>(
    EXPECTED_RETURNS.equity.toString(),
  );
  const [goldReturn, setGoldReturn] = useState<string>(
    EXPECTED_RETURNS.gold.toString(),
  );
  const [debtReturn, setDebtReturn] = useState<string>(
    EXPECTED_RETURNS.debt.toString(),
  );
  const [fdReturn, setFdReturn] = useState<string>(
    EXPECTED_RETURNS.fd.toString(),
  );

  const [results, setResults] = useState<ComparisonResults | null>(null);

  // Reset results when any input changes to prevent stale data
  useEffect(() => {
    setResults(null);
  }, [
    selectedType,
    tenure,
    monthlyInvestment,
    stepUpPercent,
    lumpsumAmount,
    equityReturn,
    goldReturn,
    debtReturn,
    fdReturn,
  ]);

  /**
   * Calculate and set results for all four investment types
   * Runs calculations for equity, gold, debt, and fixed deposit simultaneously
   * using user-specified return rates
   */
  const handleCalculate = () => {
    setResults({
      equity: calculateInvestment(
        "equity",
        parseFloat(equityReturn),
        selectedType,
        tenure,
        monthlyInvestment,
        stepUpPercent,
        lumpsumAmount,
      ),
      gold: calculateInvestment(
        "gold",
        parseFloat(goldReturn),
        selectedType,
        tenure,
        monthlyInvestment,
        stepUpPercent,
        lumpsumAmount,
      ),
      debt: calculateInvestment(
        "debt",
        parseFloat(debtReturn),
        selectedType,
        tenure,
        monthlyInvestment,
        stepUpPercent,
        lumpsumAmount,
      ),
      fd: calculateInvestment(
        "fd",
        parseFloat(fdReturn),
        selectedType,
        tenure,
        monthlyInvestment,
        stepUpPercent,
        lumpsumAmount,
      ),
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        Investment Comparison Calculator
      </h1>

      <InvestmentTypeSelector
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">
            Investment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <InvestmentDetailsForm
            selectedType={selectedType}
            monthlyInvestment={monthlyInvestment}
            setMonthlyInvestment={setMonthlyInvestment}
            stepUpPercent={stepUpPercent}
            setStepUpPercent={setStepUpPercent}
            lumpsumAmount={lumpsumAmount}
            setLumpsumAmount={setLumpsumAmount}
            tenure={tenure}
            setTenure={setTenure}
          />

          <ExpectedReturnsForm
            equityReturn={equityReturn}
            setEquityReturn={setEquityReturn}
            goldReturn={goldReturn}
            setGoldReturn={setGoldReturn}
            debtReturn={debtReturn}
            setDebtReturn={setDebtReturn}
            fdReturn={fdReturn}
            setFdReturn={setFdReturn}
          />

          <Button
            onClick={handleCalculate}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate</span>
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6 mt-6">
          <HorizontalBarChart
            data={[
              {
                key: "equity",
                name: "Equity Fund",
                value: results.equity.finalValue / results.equity.totalInvested,
                color: "bg-green-600",
              },
              {
                key: "gold",
                name: "Gold",
                value: results.gold.finalValue / results.gold.totalInvested,
                color: "bg-yellow-600",
              },
              {
                key: "debt",
                name: "Debt Fund",
                value: results.debt.finalValue / results.debt.totalInvested,
                color: "bg-blue-600",
              },
              {
                key: "fd",
                name: "Fixed Deposit",
                value: results.fd.finalValue / results.fd.totalInvested,
                color: "bg-purple-600",
              },
              {
                key: "invested",
                name: "Invested Amount",
                value: 1,
                color: "bg-gray-400",
              },
            ]}
            title="Investment Returns Comparison"
            valueLabel="x"
          />

          <ResultsSummaryCards
            results={results}
            formatCurrency={formatCurrency}
          />

          <YearlyComparisonTable
            results={results}
            formatCurrency={formatCurrency}
          />
        </div>
      )}
    </div>
  );
}
