"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HorizontalBarChart } from "@/components/common/HorizontalBarChart";
import { InvestmentMode, CalculationMode, ComparisonResults } from "./types";
import { EXPECTED_RETURNS } from "./constants";
import { formatCurrency, calculateTimeForInvestmentType, calculateForInvestmentType } from "./utils";
import { CalculationModeSelector } from "./CalculationModeSelector";
import { InvestmentModeSelector } from "./InvestmentModeSelector";
import { GoalDetailsForm } from "./GoalDetailsForm";
import { ExpectedReturnsForm } from "./ExpectedReturnsForm";
import { ResultsSummary } from "./ResultsSummary";

/**
 * Goal-based Investment Planner Calculator
 * 
 * A comprehensive calculator that helps users plan their financial goals by:
 * 1. Calculating required investment (SIP/Step-up/Lumpsum) for a given time period
 * 2. Calculating required time period for a given investment amount
 * 
 * Compares four investment types (Equity, Gold, Debt, FD) side-by-side to help
 * users make informed decisions based on their risk appetite and return expectations.
 * 
 * Features:
 * - Dual calculation modes (investment amount or time period)
 * - Three investment strategies (SIP, Step-up SIP, Lumpsum)
 * - Customizable expected returns for each investment type
 * - Visual comparison with bar charts and summary cards
 * - Highlights the most efficient investment option
 */
export default function GoalPlannerCalculator() {
  // Calculation and investment mode selection
  const [calculationMode, setCalculationMode] = useState<CalculationMode>("investment");
  const [selectedMode, setSelectedMode] = useState<InvestmentMode>("sip");
  
  // Goal parameters
  const [targetAmount, setTargetAmount] = useState<string>("5000000");      // Default: ₹50 lakhs
  const [tenure, setTenure] = useState<string>("10");                       // Default: 10 years
  const [monthlyAmount, setMonthlyAmount] = useState<string>("10000");     // Default: ₹10,000/month
  const [lumpsumAmount, setLumpsumAmount] = useState<string>("500000");    // Default: ₹5 lakhs
  const [stepUpPercentage, setStepUpPercentage] = useState<string>("10"); // Default: 10% annual increase

  // Expected returns for each investment type (customizable)
  const [equityReturn, setEquityReturn] = useState<string>(
    EXPECTED_RETURNS.equity.toString()
  );
  const [goldReturn, setGoldReturn] = useState<string>(
    EXPECTED_RETURNS.gold.toString()
  );
  const [debtReturn, setDebtReturn] = useState<string>(
    EXPECTED_RETURNS.debt.toString()
  );
  const [fdReturn, setFdReturn] = useState<string>(
    EXPECTED_RETURNS.fd.toString()
  );

  // Calculation results for all investment types
  const [results, setResults] = useState<ComparisonResults | null>(null);

  // Reset results when any input changes to ensure fresh calculations
  useEffect(() => {
    setResults(null);
  }, [calculationMode, selectedMode, targetAmount, tenure, monthlyAmount, lumpsumAmount, stepUpPercentage, equityReturn, goldReturn, debtReturn, fdReturn]);

  /**
   * Main calculation trigger function
   * 
   * Performs calculations for all four investment types based on the selected
   * calculation mode (investment amount or time period) and updates results state.
   */
  const calculateGoal = () => {
    if (calculationMode === "time") {
      // Calculate time required for each investment type
      setResults({
        equity: calculateTimeForInvestmentType(
          "equity",
          parseFloat(equityReturn),
          targetAmount,
          selectedMode,
          monthlyAmount,
          lumpsumAmount,
          stepUpPercentage
        ),
        gold: calculateTimeForInvestmentType(
          "gold",
          parseFloat(goldReturn),
          targetAmount,
          selectedMode,
          monthlyAmount,
          lumpsumAmount,
          stepUpPercentage
        ),
        debt: calculateTimeForInvestmentType(
          "debt",
          parseFloat(debtReturn),
          targetAmount,
          selectedMode,
          monthlyAmount,
          lumpsumAmount,
          stepUpPercentage
        ),
        fd: calculateTimeForInvestmentType(
          "fd",
          parseFloat(fdReturn),
          targetAmount,
          selectedMode,
          monthlyAmount,
          lumpsumAmount,
          stepUpPercentage
        ),
      });
    } else {
      // Calculate required investment for each investment type
      setResults({
        equity: calculateForInvestmentType(
          "equity",
          parseFloat(equityReturn),
          targetAmount,
          tenure,
          selectedMode,
          stepUpPercentage
        ),
        gold: calculateForInvestmentType(
          "gold",
          parseFloat(goldReturn),
          targetAmount,
          tenure,
          selectedMode,
          stepUpPercentage
        ),
        debt: calculateForInvestmentType(
          "debt",
          parseFloat(debtReturn),
          targetAmount,
          tenure,
          selectedMode,
          stepUpPercentage
        ),
        fd: calculateForInvestmentType(
          "fd",
          parseFloat(fdReturn),
          targetAmount,
          tenure,
          selectedMode,
          stepUpPercentage
        ),
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Goal-based Investment Planner</h1>

      <CalculationModeSelector
        selectedMode={calculationMode}
        onModeChange={setCalculationMode}
      />

      <InvestmentModeSelector
        selectedMode={selectedMode}
        onModeChange={setSelectedMode}
      />

      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">Goal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <GoalDetailsForm
            calculationMode={calculationMode}
            selectedMode={selectedMode}
            targetAmount={targetAmount}
            setTargetAmount={setTargetAmount}
            tenure={tenure}
            setTenure={setTenure}
            monthlyAmount={monthlyAmount}
            setMonthlyAmount={setMonthlyAmount}
            lumpsumAmount={lumpsumAmount}
            setLumpsumAmount={setLumpsumAmount}
            stepUpPercentage={stepUpPercentage}
            setStepUpPercentage={setStepUpPercentage}
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
            onClick={calculateGoal}
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
                value: calculationMode === "time" ? (results.equity.requiredYears || 0) : (selectedMode === "lumpsum" ? results.equity.totalInvested : (results.equity.requiredMonthly || 0)),
                color: "bg-green-600",
              },
              {
                key: "gold",
                name: "Gold",
                value: calculationMode === "time" ? (results.gold.requiredYears || 0) : (selectedMode === "lumpsum" ? results.gold.totalInvested : (results.gold.requiredMonthly || 0)),
                color: "bg-yellow-600",
              },
              {
                key: "debt",
                name: "Debt Fund",
                value: calculationMode === "time" ? (results.debt.requiredYears || 0) : (selectedMode === "lumpsum" ? results.debt.totalInvested : (results.debt.requiredMonthly || 0)),
                color: "bg-blue-600",
              },
              {
                key: "fd",
                name: "Fixed Deposit",
                value: calculationMode === "time" ? (results.fd.requiredYears || 0) : (selectedMode === "lumpsum" ? results.fd.totalInvested : (results.fd.requiredMonthly || 0)),
                color: "bg-purple-600",
              },
            ]}
            title={calculationMode === "time" ? "Time Required to Achieve Target" : (selectedMode === "lumpsum" ? "Lumpsum Investment Required to Achieve Target" : selectedMode === "stepup" ? "Initial Monthly SIP Required (with Step-up)" : "Monthly SIP Required to Achieve Target")}
            formatValue={(value) => calculationMode === "time" ? `${(value || 0).toFixed(1)} years` : formatCurrency(value)}
            valueLabel=""
          />

          <ResultsSummary
            results={results}
            calculationMode={calculationMode}
            selectedMode={selectedMode}
            formatCurrency={formatCurrency}
          />
        </div>
      )}
    </div>
  );
}
