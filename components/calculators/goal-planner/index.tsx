"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { SummaryDataPoint } from "@/components/common/SummaryDataPoint";
import { TabSelector } from "@/components/common/TabSelector";
import { HorizontalBarChart } from "@/components/common/HorizontalBarChart";

type InvestmentMode = "sip" | "stepup" | "lumpsum";
type CalculationMode = "investment" | "time";

interface GoalResult {
  name: string;
  targetAmount: number;
  requiredMonthly?: number;
  requiredLumpsum?: number;
  requiredYears?: number;
  totalInvested: number;
  totalReturns: number;
  expectedReturn: number;
}

interface ComparisonResults {
  equity: GoalResult;
  gold: GoalResult;
  debt: GoalResult;
  fd: GoalResult;
}

// Expected annual returns for different investment types
const EXPECTED_RETURNS = {
  equity: 12,
  gold: 10,
  debt: 7,
  fd: 6.5,
};

const INVESTMENT_NAMES = {
  equity: "Equity Fund",
  gold: "Gold",
  debt: "Debt Fund",
  fd: "Fixed Deposit",
};

const INVESTMENT_MODE_OPTIONS = [
  { value: "sip", label: "SIP" },
  { value: "stepup", label: "Step-up SIP" },
  { value: "lumpsum", label: "Lumpsum" },
];

const CALCULATION_MODE_OPTIONS = [
  { value: "investment", label: "Calculate Investment" },
  { value: "time", label: "Calculate Time" },
];

// Subcomponent: Calculation Mode Selector
function CalculationModeSelector({
  selectedMode,
  onModeChange,
}: {
  selectedMode: CalculationMode;
  onModeChange: (mode: CalculationMode) => void;
}) {
  return (
    <div className="mb-6">
      <TabSelector
        options={CALCULATION_MODE_OPTIONS}
        selected={selectedMode}
        onChange={(value) => onModeChange(value as CalculationMode)}
        columns={2}
      />
    </div>
  );
}

// Subcomponent: Investment Mode Selector
function InvestmentModeSelector({
  selectedMode,
  onModeChange,
}: {
  selectedMode: InvestmentMode;
  onModeChange: (mode: InvestmentMode) => void;
}) {
  return (
    <div className="mb-8">
      <TabSelector
        options={INVESTMENT_MODE_OPTIONS}
        selected={selectedMode}
        onChange={(value) => onModeChange(value as InvestmentMode)}
        columns={3}
      />
    </div>
  );
}

// Subcomponent: Goal Details Form
function GoalDetailsForm({
  calculationMode,
  selectedMode,
  targetAmount,
  setTargetAmount,
  tenure,
  setTenure,
  monthlyAmount,
  setMonthlyAmount,
  lumpsumAmount,
  setLumpsumAmount,
  stepUpPercentage,
  setStepUpPercentage,
}: {
  calculationMode: CalculationMode;
  selectedMode: InvestmentMode;
  targetAmount: string;
  setTargetAmount: (value: string) => void;
  tenure: string;
  setTenure: (value: string) => void;
  monthlyAmount: string;
  setMonthlyAmount: (value: string) => void;
  lumpsumAmount: string;
  setLumpsumAmount: (value: string) => void;
  stepUpPercentage: string;
  setStepUpPercentage: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        id="targetAmount"
        label="Target Amount (₹)"
        arrowStep={100000}
        value={targetAmount}
        onChange={setTargetAmount}
      />
      {calculationMode === "investment" ? (
        <FormField
          id="tenure"
          label="Time Period (years)"
          arrowStep={1}
          value={tenure}
          onChange={setTenure}
        />
      ) : (
        selectedMode === "lumpsum" ? (
          <FormField
            id="lumpsumAmount"
            label="Lumpsum Amount (₹)"
            arrowStep={10000}
            value={lumpsumAmount}
            onChange={setLumpsumAmount}
          />
        ) : (
          <FormField
            id="monthlyAmount"
            label="Monthly SIP (₹)"
            arrowStep={1000}
            value={monthlyAmount}
            onChange={setMonthlyAmount}
          />
        )
      )}
      {selectedMode === "stepup" && (
        <FormField
          id="stepUpPercentage"
          label="Annual Step-up (%)"
          step="0.1"
          arrowStep={1}
          value={stepUpPercentage}
          onChange={setStepUpPercentage}
        />
      )}
    </div>
  );
}

// Subcomponent: Expected Returns Form
function ExpectedReturnsForm({
  equityReturn,
  setEquityReturn,
  goldReturn,
  setGoldReturn,
  debtReturn,
  setDebtReturn,
  fdReturn,
  setFdReturn,
}: {
  equityReturn: string;
  setEquityReturn: (value: string) => void;
  goldReturn: string;
  setGoldReturn: (value: string) => void;
  debtReturn: string;
  setDebtReturn: (value: string) => void;
  fdReturn: string;
  setFdReturn: (value: string) => void;
}) {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Expected Annual Returns (%)</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FormField
          id="equityReturn"
          label="Equity Fund"
          step="0.1"
          arrowStep={0.5}
          value={equityReturn}
          onChange={setEquityReturn}
        />
        <FormField
          id="goldReturn"
          label="Gold"
          step="0.1"
          arrowStep={0.5}
          value={goldReturn}
          onChange={setGoldReturn}
        />
        <FormField
          id="debtReturn"
          label="Debt Fund"
          step="0.1"
          arrowStep={0.5}
          value={debtReturn}
          onChange={setDebtReturn}
        />
        <FormField
          id="fdReturn"
          label="Fixed Deposit"
          step="0.1"
          arrowStep={0.5}
          value={fdReturn}
          onChange={setFdReturn}
        />
      </div>
    </div>
  );
}

// Subcomponent: Results Summary
function ResultsSummary({
  results,
  calculationMode,
  selectedMode,
  formatCurrency,
}: {
  results: ComparisonResults;
  calculationMode: CalculationMode;
  selectedMode: InvestmentMode;
  formatCurrency: (value: number) => string;
}) {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">
        Target Amount: {formatCurrency(results.equity.targetAmount)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(results) as Array<keyof typeof results>).map((key) => {
          const result = results[key];
          const isLowest = Object.values(results).every(
            (r) => result.totalInvested <= r.totalInvested
          );

          return (
            <Card
              key={key}
              className={`rounded-none ${isLowest ? "border-2 border-primary" : ""}`}
            >
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-xl flex items-center justify-between">
                  <span>{result.name}</span>
                  {isLowest && (
                    <span className="text-sm font-normal bg-primary text-primary-foreground px-3 py-1 rounded-none">
                      Lowest Investment
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <SummaryDataPoint
                    label="Expected Return"
                    value={`${result.expectedReturn}% p.a.`}
                  />
                  {calculationMode === "investment" ? (
                    <SummaryDataPoint
                      label={selectedMode === "lumpsum" ? "Lumpsum" : "Monthly SIP"}
                      value={formatCurrency(
                        selectedMode === "lumpsum"
                          ? (result.requiredLumpsum || 0)
                          : (result.requiredMonthly || 0)
                      )}
                      size="large"
                    />
                  ) : (
                    <SummaryDataPoint
                      label="Time Required"
                      value={`${(result.requiredYears || 0).toFixed(1)} years`}
                      size="large"
                    />
                  )}
                  <SummaryDataPoint
                    label="Total Investment"
                    value={formatCurrency(result.totalInvested)}
                  />
                  <SummaryDataPoint
                    label="Expected Returns"
                    value={formatCurrency(result.totalReturns)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function GoalPlannerCalculator() {
  const [calculationMode, setCalculationMode] = useState<CalculationMode>("investment");
  const [selectedMode, setSelectedMode] = useState<InvestmentMode>("sip");
  const [targetAmount, setTargetAmount] = useState<string>("5000000");
  const [tenure, setTenure] = useState<string>("10");
  const [monthlyAmount, setMonthlyAmount] = useState<string>("10000");
  const [lumpsumAmount, setLumpsumAmount] = useState<string>("500000");
  const [stepUpPercentage, setStepUpPercentage] = useState<string>("10");

  // Expected returns for each investment type
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

  const [results, setResults] = useState<ComparisonResults | null>(null);

  // Reset results when any input changes
  useEffect(() => {
    setResults(null);
  }, [calculationMode, selectedMode, targetAmount, tenure, monthlyAmount, lumpsumAmount, stepUpPercentage, equityReturn, goldReturn, debtReturn, fdReturn]);

  const calculateTimeForInvestmentType = (
    type: keyof typeof EXPECTED_RETURNS,
    customReturn: number
  ): GoalResult => {
    const target = parseFloat(targetAmount);
    const annualReturn = customReturn / 100;
    const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;

    if (selectedMode === "lumpsum") {
      const lumpsum = parseFloat(lumpsumAmount);
      // FV = PV × (1 + r)^n
      // Rearranged: n = ln(FV/PV) / ln(1 + r)
      const years = Math.log(target / lumpsum) / Math.log(1 + annualReturn);
      const totalInvested = lumpsum;

      return {
        name: INVESTMENT_NAMES[type],
        targetAmount: target,
        requiredYears: years,
        requiredLumpsum: lumpsum,
        totalInvested,
        totalReturns: target - totalInvested,
        expectedReturn: customReturn,
      };
    } else if (selectedMode === "sip") {
      const monthly = parseFloat(monthlyAmount);
      // FV = PMT × [(1 + r)^n - 1] / r
      // Rearranged: n = ln(1 + FV×r/PMT) / ln(1 + r)
      const months = Math.log(1 + (target * monthlyReturn) / monthly) / Math.log(1 + monthlyReturn);
      const years = months / 12;
      const totalInvested = monthly * months;

      return {
        name: INVESTMENT_NAMES[type],
        targetAmount: target,
        requiredYears: years,
        requiredMonthly: monthly,
        totalInvested,
        totalReturns: target - totalInvested,
        expectedReturn: customReturn,
      };
    } else {
      // Step-up SIP time calculation (iterative approach)
      const monthly = parseFloat(monthlyAmount);
      const stepUp = parseFloat(stepUpPercentage) / 100;
      const monthlyStepUp = Math.pow(1 + stepUp, 1 / 12) - 1;
      
      let months = 0;
      let currentValue = 0;
      let totalInvested = 0;
      const maxMonths = 1200; // 100 years max
      
      while (currentValue < target && months < maxMonths) {
        const currentSIP = monthly * Math.pow(1 + monthlyStepUp, months);
        totalInvested += currentSIP;
        currentValue = currentValue * (1 + monthlyReturn) + currentSIP;
        months++;
      }
      
      const years = months / 12;

      return {
        name: INVESTMENT_NAMES[type],
        targetAmount: target,
        requiredYears: years,
        requiredMonthly: monthly,
        totalInvested,
        totalReturns: target - totalInvested,
        expectedReturn: customReturn,
      };
    }
  };

  const calculateForInvestmentType = (
    type: keyof typeof EXPECTED_RETURNS,
    customReturn: number
  ): GoalResult => {
    const target = parseFloat(targetAmount);
    const years = parseFloat(tenure);
    const annualReturn = customReturn / 100;
    const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;

    if (selectedMode === "sip") {
      const months = years * 12;
      const requiredMonthly =
        (target * monthlyReturn) / (Math.pow(1 + monthlyReturn, months) - 1);
      const totalInvested = requiredMonthly * months;

      return {
        name: INVESTMENT_NAMES[type],
        targetAmount: target,
        requiredMonthly,
        totalInvested,
        totalReturns: target - totalInvested,
        expectedReturn: customReturn,
      };
    } else if (selectedMode === "stepup") {
      const months = years * 12;
      const stepUp = parseFloat(stepUpPercentage) / 100;
      const monthlyStepUp = Math.pow(1 + stepUp, 1 / 12) - 1;

      // For step-up SIP, we need to solve for the initial monthly SIP
      // FV = PMT × [(1 + r)^n - (1 + s)^n] / (r - s)
      // Rearranged: PMT = FV × (r - s) / [(1 + r)^n - (1 + s)^n]
      let requiredMonthly: number;
      let totalInvested = 0;

      if (Math.abs(monthlyReturn - monthlyStepUp) < 0.00001) {
        // When rates are equal: FV = n × PMT × (1 + r)^(n-1)
        // So: PMT = FV / [n × (1 + r)^(n-1)]
        requiredMonthly = target / (months * Math.pow(1 + monthlyReturn, months - 1));
      } else {
        const powerR = Math.pow(1 + monthlyReturn, months);
        const powerS = Math.pow(1 + monthlyStepUp, months);
        requiredMonthly = (target * (monthlyReturn - monthlyStepUp)) / (powerR - powerS);
      }

      // Calculate total invested with step-up
      for (let i = 0; i < months; i++) {
        totalInvested += requiredMonthly * Math.pow(1 + monthlyStepUp, i);
      }

      return {
        name: INVESTMENT_NAMES[type],
        targetAmount: target,
        requiredMonthly,
        totalInvested,
        totalReturns: target - totalInvested,
        expectedReturn: customReturn,
      };
    } else {
      const requiredLumpsum = target / Math.pow(1 + annualReturn, years);
      const totalInvested = requiredLumpsum;

      return {
        name: INVESTMENT_NAMES[type],
        targetAmount: target,
        requiredLumpsum,
        totalInvested,
        totalReturns: target - totalInvested,
        expectedReturn: customReturn,
      };
    }
  };

  const calculateGoal = () => {
    if (calculationMode === "time") {
      setResults({
        equity: calculateTimeForInvestmentType("equity", parseFloat(equityReturn)),
        gold: calculateTimeForInvestmentType("gold", parseFloat(goldReturn)),
        debt: calculateTimeForInvestmentType("debt", parseFloat(debtReturn)),
        fd: calculateTimeForInvestmentType("fd", parseFloat(fdReturn)),
      });
    } else {
      setResults({
        equity: calculateForInvestmentType("equity", parseFloat(equityReturn)),
        gold: calculateForInvestmentType("gold", parseFloat(goldReturn)),
        debt: calculateForInvestmentType("debt", parseFloat(debtReturn)),
        fd: calculateForInvestmentType("fd", parseFloat(fdReturn)),
      });
    }
  };  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
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

      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-2xl">Goal Details</CardTitle>
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
