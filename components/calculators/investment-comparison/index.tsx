"use client";

import { useState, useEffect } from "react";
import { TabSelector } from "@/components/common/TabSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { SummaryDataPoint } from "@/components/common/SummaryDataPoint";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { HorizontalBarChart } from "@/components/common/HorizontalBarChart";

type InvestmentType = "sip" | "stepup-sip" | "lumpsum" | "recurring";

interface InvestmentResult {
  name: string;
  totalInvested: number;
  finalValue: number;
  totalReturns: number;
  returnPercentage: number;
  annualReturn: number;
  yearlyBreakdown: Array<{
    year: number;
    invested: number;
    value: number;
  }>;
}

interface ComparisonResults {
  equity: InvestmentResult;
  gold: InvestmentResult;
  debt: InvestmentResult;
  fd: InvestmentResult;
}

const INVESTMENT_TYPE_OPTIONS = [
  { value: "sip", label: "SIP" },
  { value: "stepup-sip", label: "Step-up SIP" },
  { value: "lumpsum", label: "Lumpsum" },
];

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

// Subcomponent: Investment Type Selector
function InvestmentTypeSelector({
  selectedType,
  onTypeChange,
}: {
  selectedType: InvestmentType;
  onTypeChange: (type: InvestmentType) => void;
}) {
  return (
    <div className="mb-8">
      <TabSelector
        options={INVESTMENT_TYPE_OPTIONS}
        selected={selectedType}
        onChange={(value) => onTypeChange(value as InvestmentType)}
        columns={3}
      />
    </div>
  );
}

// Subcomponent: Investment Details Form
function InvestmentDetailsForm({
  selectedType,
  monthlyInvestment,
  setMonthlyInvestment,
  stepUpPercent,
  setStepUpPercent,
  lumpsumAmount,
  setLumpsumAmount,
  tenure,
  setTenure,
}: {
  selectedType: InvestmentType;
  monthlyInvestment: string;
  setMonthlyInvestment: (value: string) => void;
  stepUpPercent: string;
  setStepUpPercent: (value: string) => void;
  lumpsumAmount: string;
  setLumpsumAmount: (value: string) => void;
  tenure: string;
  setTenure: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* SIP Fields */}
      {selectedType === "sip" && (
        <>
          <FormField
            id="monthlyInvestment"
            label="Monthly Investment (₹)"
            arrowStep={1000}
            value={monthlyInvestment}
            onChange={setMonthlyInvestment}
          />
          <FormField
            id="tenure"
            label="Investment Period (years)"
            arrowStep={1}
            value={tenure}
            onChange={setTenure}
          />
        </>
      )}

      {/* Step-up SIP Fields */}
      {selectedType === "stepup-sip" && (
        <>
          <FormField
            id="monthlyInvestment"
            label="Initial Monthly Investment (₹)"
            arrowStep={1000}
            value={monthlyInvestment}
            onChange={setMonthlyInvestment}
          />
          <FormField
            id="stepUpPercent"
            label="Annual Step-up (%)"
            step="1"
            arrowStep={5}
            value={stepUpPercent}
            onChange={setStepUpPercent}
          />
          <FormField
            id="tenure"
            label="Investment Period (years)"
            arrowStep={1}
            value={tenure}
            onChange={setTenure}
          />
        </>
      )}

      {/* Lumpsum Fields */}
      {selectedType === "lumpsum" && (
        <>
          <FormField
            id="lumpsumAmount"
            label="Investment Amount (₹)"
            arrowStep={10000}
            value={lumpsumAmount}
            onChange={setLumpsumAmount}
          />
          <FormField
            id="tenure"
            label="Investment Period (years)"
            arrowStep={1}
            value={tenure}
            onChange={setTenure}
          />
        </>
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

// Subcomponent: Results Summary Cards
function ResultsSummaryCards({
  results,
  formatCurrency,
}: {
  results: ComparisonResults;
  formatCurrency: (value: number) => string;
}) {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">
        Total Invested: {formatCurrency(results.equity.totalInvested)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(results) as Array<keyof typeof results>).map((key) => {
          const result = results[key];
          const isBest = Object.values(results).every(r => result.finalValue >= r.finalValue);
          const multiplier = result.finalValue / result.totalInvested;
          const showAsMultiplier = result.returnPercentage >= 100;
          
          return (
            <Card key={key} className={`rounded-none ${isBest ? "border-2 border-primary" : ""}`}>
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-xl flex items-center justify-between">
                  <span>{result.name}</span>
                  {isBest && (
                    <span className="text-sm font-normal bg-primary text-primary-foreground px-3 py-1 rounded-none">
                      Best Return
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <SummaryDataPoint
                    label="Expected Return"
                    value={`${result.annualReturn}% p.a.`}
                  />
                  <SummaryDataPoint
                    label="Final Value"
                    value={formatCurrency(result.finalValue)}
                    size="large"
                  />
                  <SummaryDataPoint
                    label={showAsMultiplier ? "Growth Multiple" : "Return Rate"}
                    value={showAsMultiplier ? `${multiplier.toFixed(2)}x` : `${result.returnPercentage.toFixed(2)}%`}
                  />
                  <SummaryDataPoint
                    label="Total Returns"
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

// Subcomponent: Yearly Comparison Table
function YearlyComparisonTable({
  results,
  formatCurrency,
}: {
  results: ComparisonResults;
  formatCurrency: (value: number) => string;
}) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl">Year-by-Year Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <DataTable
          data={results.equity.yearlyBreakdown}
          columns={[
            { key: "year", header: "Year", align: "left" },
            {
              key: "year",
              header: "Equity Fund",
              align: "right",
              className: "text-green-600 font-medium",
              render: (value) => formatCurrency(results.equity.yearlyBreakdown[value - 1].value),
            },
            {
              key: "year",
              header: "Gold",
              align: "right",
              className: "text-yellow-600 font-medium",
              render: (value) => formatCurrency(results.gold.yearlyBreakdown[value - 1].value),
            },
            {
              key: "year",
              header: "Debt Fund",
              align: "right",
              className: "text-blue-600 font-medium",
              render: (value) => formatCurrency(results.debt.yearlyBreakdown[value - 1].value),
            },
            {
              key: "year",
              header: "Fixed Deposit",
              align: "right",
              className: "text-purple-600 font-medium",
              render: (value) => formatCurrency(results.fd.yearlyBreakdown[value - 1].value),
            },
            {
              key: "year",
              header: "Total Invested",
              align: "right",
              className: "font-medium",
              render: (value) => formatCurrency(results.equity.yearlyBreakdown[value - 1].invested),
            },
          ]}
          getRowKey={(row) => row.year}
        />
      </CardContent>
    </Card>
  );
}

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
  const [equityReturn, setEquityReturn] = useState<string>(EXPECTED_RETURNS.equity.toString());
  const [goldReturn, setGoldReturn] = useState<string>(EXPECTED_RETURNS.gold.toString());
  const [debtReturn, setDebtReturn] = useState<string>(EXPECTED_RETURNS.debt.toString());
  const [fdReturn, setFdReturn] = useState<string>(EXPECTED_RETURNS.fd.toString());

  const [results, setResults] = useState<ComparisonResults | null>(null);

  // Reset results when any input changes
  useEffect(() => {
    setResults(null);
  }, [selectedType, tenure, monthlyInvestment, stepUpPercent, lumpsumAmount, equityReturn, goldReturn, debtReturn, fdReturn]);

  const calculateInvestment = (type: keyof typeof EXPECTED_RETURNS, customReturn: number): InvestmentResult => {
    const years = parseFloat(tenure);
    const annualReturn = customReturn / 100;
    const yearlyBreakdown = [];
    let totalInvested = 0;
    let currentValue = 0;

    if (selectedType === "sip") {
      const monthly = parseFloat(monthlyInvestment);
      
      for (let year = 1; year <= years; year++) {
        // Calculate SIP for this year
        const yearlyContribution = monthly * 12;
        totalInvested += yearlyContribution;
        
        // Apply growth to existing value
        currentValue = currentValue * (1 + annualReturn);
        
        // Add monthly contributions with growth
        for (let month = 1; month <= 12; month++) {
          const monthsRemaining = 12 - month;
          const monthlyGrowth = Math.pow(1 + annualReturn, monthsRemaining / 12);
          currentValue += monthly * monthlyGrowth;
        }

        yearlyBreakdown.push({ year, invested: totalInvested, value: currentValue });
      }
    } else if (selectedType === "stepup-sip") {
      const initialMonthly = parseFloat(monthlyInvestment);
      const stepUp = parseFloat(stepUpPercent) / 100;
      
      for (let year = 1; year <= years; year++) {
        const currentMonthly = initialMonthly * Math.pow(1 + stepUp, year - 1);
        const yearlyContribution = currentMonthly * 12;
        totalInvested += yearlyContribution;
        
        // Apply growth to existing value
        currentValue = currentValue * (1 + annualReturn);
        
        // Add monthly contributions with growth
        for (let month = 1; month <= 12; month++) {
          const monthsRemaining = 12 - month;
          const monthlyGrowth = Math.pow(1 + annualReturn, monthsRemaining / 12);
          currentValue += currentMonthly * monthlyGrowth;
        }

        yearlyBreakdown.push({ year, invested: totalInvested, value: currentValue });
      }
    } else if (selectedType === "lumpsum") {
      const amount = parseFloat(lumpsumAmount);
      totalInvested = amount;
      currentValue = amount;
      
      for (let year = 1; year <= years; year++) {
        currentValue = currentValue * (1 + annualReturn);
        yearlyBreakdown.push({ year, invested: totalInvested, value: currentValue });
      }
    }

    const finalValue = currentValue;
    const totalReturns = finalValue - totalInvested;
    const returnPercentage = (totalReturns / totalInvested) * 100;

    return {
      name: INVESTMENT_NAMES[type],
      totalInvested,
      finalValue,
      totalReturns,
      returnPercentage,
      annualReturn: customReturn,
      yearlyBreakdown,
    };
  };

  const handleCalculate = () => {
    setResults({
      equity: calculateInvestment("equity", parseFloat(equityReturn)),
      gold: calculateInvestment("gold", parseFloat(goldReturn)),
      debt: calculateInvestment("debt", parseFloat(debtReturn)),
      fd: calculateInvestment("fd", parseFloat(fdReturn)),
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Investment Comparison Calculator</h1>
      
      <InvestmentTypeSelector
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-2xl">Investment Details</CardTitle>
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

          <Button onClick={handleCalculate} className="group relative w-full overflow-hidden rounded-none h-12 text-base">
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
                color: "bg-green-600" 
              },
              { 
                key: "gold", 
                name: "Gold", 
                value: results.gold.finalValue / results.gold.totalInvested,
                color: "bg-yellow-600" 
              },
              { 
                key: "debt", 
                name: "Debt Fund", 
                value: results.debt.finalValue / results.debt.totalInvested,
                color: "bg-blue-600" 
              },
              { 
                key: "fd", 
                name: "Fixed Deposit", 
                value: results.fd.finalValue / results.fd.totalInvested,
                color: "bg-purple-600" 
              },
              { 
                key: "invested", 
                name: "Invested Amount", 
                value: 1,
                color: "bg-gray-400" 
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
