"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/common/FormField";
import { SummaryDataPoint } from "@/components/common/SummaryDataPoint";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";

interface RentVsBuyResult {
  // Rent Scenario
  totalRentPaid: number;
  investmentValue: number;
  totalRentCost: number; // rent paid - investment value
  netWorthRent: number;
  
  // Buy Scenario
  totalEMIPaid: number;
  propertyValue: number;
  totalMaintenancePaid: number;
  totalBuyCost: number;
  netWorthBuy: number;
  
  // Comparison
  difference: number;
  betterOption: "rent" | "buy";
  
  yearlyBreakdown: Array<{
    year: number;
    rentPaid: number;
    investmentGrowth: number;
    emiPaid: number;
    propertyValue: number;
    maintenancePaid: number;
    netWorthRent: number;
    netWorthBuy: number;
  }>;
}

interface ScenarioInputsProps {
  // Property Details
  propertyValue: string;
  setPropertyValue: (value: string) => void;
  downPaymentPercent: string;
  setDownPaymentPercent: (value: string) => void;
  interestRate: string;
  setInterestRate: (value: string) => void;
  tenure: string;
  setTenure: (value: string) => void;
  
  // Rent Scenario
  monthlyRent: string;
  setMonthlyRent: (value: string) => void;
  rentIncreaseRate: string;
  setRentIncreaseRate: (value: string) => void;
  investmentReturn: string;
  setInvestmentReturn: (value: string) => void;
  
  // Buy Scenario
  propertyAppreciation: string;
  setPropertyAppreciation: (value: string) => void;
  maintenancePercent: string;
  setMaintenancePercent: (value: string) => void;
  
  onCalculate: () => void;
}

function ScenarioInputs({
  propertyValue,
  setPropertyValue,
  downPaymentPercent,
  setDownPaymentPercent,
  interestRate,
  setInterestRate,
  tenure,
  setTenure,
  monthlyRent,
  setMonthlyRent,
  rentIncreaseRate,
  setRentIncreaseRate,
  investmentReturn,
  setInvestmentReturn,
  propertyAppreciation,
  setPropertyAppreciation,
  maintenancePercent,
  setMaintenancePercent,
  onCalculate,
}: ScenarioInputsProps) {
  const propValue = parseFloat(propertyValue) || 0;
  const downPayment = parseFloat(downPaymentPercent) || 0;
  const calculatedDownPayment = propValue * (downPayment / 100);
  const calculatedLoanAmount = propValue * (1 - downPayment / 100);

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl">Scenario Inputs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Property Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              id="propertyValue"
              label="Property Value (₹)"
              arrowStep={100000}
              value={propertyValue}
              onChange={setPropertyValue}
            />

            <FormField
              id="downPaymentPercent"
              label="Down Payment (%)"
              step="1"
              arrowStep={5}
              value={downPaymentPercent}
              onChange={setDownPaymentPercent}
            />

            <div className="space-y-2">
              <Label className="text-base">Down Payment Amount</Label>
              <div className="h-12 flex items-center px-3 bg-muted rounded-none border text-base font-medium">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(calculatedDownPayment)}
              </div>
            </div>

            <FormField
              id="interestRate"
              label="Interest Rate (% per annum)"
              step="0.1"
              arrowStep={0.1}
              value={interestRate}
              onChange={setInterestRate}
            />

            <FormField
              id="tenure"
              label="Tenure (years)"
              arrowStep={1}
              value={tenure}
              onChange={setTenure}
            />

            <div className="space-y-2">
              <Label className="text-base">Loan Amount</Label>
              <div className="h-12 flex items-center px-3 bg-muted rounded-none border text-base font-medium">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(calculatedLoanAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Rent Scenario */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Rent Scenario</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              id="monthlyRent"
              label="Initial Monthly Rent (₹)"
              arrowStep={1000}
              value={monthlyRent}
              onChange={setMonthlyRent}
            />

            <FormField
              id="rentIncreaseRate"
              label="Annual Rent Increase (%)"
              step="0.5"
              arrowStep={0.5}
              value={rentIncreaseRate}
              onChange={setRentIncreaseRate}
            />

            <FormField
              id="investmentReturn"
              label="Investment Return Rate (%)"
              step="0.5"
              arrowStep={0.5}
              value={investmentReturn}
              onChange={setInvestmentReturn}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            When renting, you invest the down payment amount and continue investing the difference between rent and EMI.
          </p>
        </div>

        {/* Buy Scenario */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Buy Scenario</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              id="propertyAppreciation"
              label="Property Appreciation (%)"
              step="0.5"
              arrowStep={0.5}
              value={propertyAppreciation}
              onChange={setPropertyAppreciation}
            />

            <FormField
              id="maintenancePercent"
              label="Annual Maintenance (% of value)"
              step="0.1"
              arrowStep={0.1}
              value={maintenancePercent}
              onChange={setMaintenancePercent}
            />
          </div>
        </div>

        <Button onClick={onCalculate} className="group relative w-full overflow-hidden rounded-none h-12 text-base">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Calculate</span>
        </Button>
      </CardContent>
    </Card>
  );
}

interface ResultsSummaryProps {
  result: RentVsBuyResult;
  tenure: string;
  formatCurrency: (value: number) => string;
}

function ResultsSummary({ result, tenure, formatCurrency }: ResultsSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Rent Scenario Summary */}
      <Card className="rounded-none border-blue-200 dark:border-blue-900">
        <CardHeader className="bg-blue-50 dark:bg-blue-950/30">
          <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">Rent Scenario (After {tenure} years)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryDataPoint
              label="Total Rent Paid"
              value={formatCurrency(result.totalRentPaid)}
            />
            <SummaryDataPoint
              label="Investment Portfolio Value"
              value={formatCurrency(result.investmentValue)}
            />
            <SummaryDataPoint
              label="Net Worth (Rent)"
              value={formatCurrency(result.netWorthRent)}
              size="large"
            />
          </div>
        </CardContent>
      </Card>

      {/* Buy Scenario Summary */}
      <Card className="rounded-none border-green-200 dark:border-green-900">
        <CardHeader className="bg-green-50 dark:bg-green-950/30">
          <CardTitle className="text-2xl text-green-900 dark:text-green-100">Buy Scenario (After {tenure} years)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryDataPoint
              label="Total EMI Paid"
              value={formatCurrency(result.totalEMIPaid)}
            />
            <SummaryDataPoint
              label="Property Value"
              value={formatCurrency(result.propertyValue)}
            />
            <SummaryDataPoint
              label="Total Maintenance Paid"
              value={formatCurrency(result.totalMaintenancePaid)}
            />
            <SummaryDataPoint
              label="Net Worth (Buy)"
              value={formatCurrency(result.netWorthBuy)}
              size="large"
            />
          </div>
        </CardContent>
      </Card>

      {/* Comparison */}
      <Card className={`rounded-none border-2 ${result.betterOption === "rent" ? "border-blue-500" : "border-green-500"}`}>
        <CardHeader className={result.betterOption === "rent" ? "bg-blue-100 dark:bg-blue-950/50" : "bg-green-100 dark:bg-green-950/50"}>
          <CardTitle className="text-2xl">Verdict</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SummaryDataPoint
              label="Better Option"
              value={result.betterOption === "rent" ? "Rent & Invest" : "Buy"}
              size="large"
            />
            <SummaryDataPoint
              label="Financial Advantage"
              value={formatCurrency(Math.abs(result.difference))}
              size="large"
            />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {result.betterOption === "rent" 
              ? "Renting and investing provides better financial outcomes over this period."
              : "Buying the property provides better financial outcomes over this period."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface YearlyBreakdownTableProps {
  result: RentVsBuyResult;
  formatCurrency: (value: number) => string;
}

function YearlyBreakdownTable({ result, formatCurrency }: YearlyBreakdownTableProps) {
  const columns: DataTableColumn<typeof result.yearlyBreakdown[0]>[] = [
    {
      key: "year",
      header: "Year",
      align: "left",
    },
    {
      key: "rentPaid",
      header: "Rent Paid (Annual)",
      align: "right",
      className: "text-blue-600 font-medium",
      render: (value) => formatCurrency(value),
    },
    {
      key: "investmentGrowth",
      header: "Investment Value",
      align: "right",
      className: "text-blue-600 font-medium",
      render: (value) => formatCurrency(value),
    },
    {
      key: "netWorthRent",
      header: "Net Worth (Rent)",
      align: "right",
      className: "text-blue-700 dark:text-blue-400 font-semibold",
      render: (value) => formatCurrency(value),
    },
    {
      key: "emiPaid",
      header: "EMI Paid (Annual)",
      align: "right",
      className: "text-green-600 font-medium",
      render: (value) => formatCurrency(value),
    },
    {
      key: "propertyValue",
      header: "Property Value",
      align: "right",
      className: "text-green-600 font-medium",
      render: (value) => formatCurrency(value),
    },
    {
      key: "netWorthBuy",
      header: "Net Worth (Buy)",
      align: "right",
      className: "text-green-700 dark:text-green-400 font-semibold",
      render: (value) => formatCurrency(value),
    },
  ];

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl">Year-by-Year Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <DataTable 
          data={result.yearlyBreakdown} 
          columns={columns}
          getRowKey={(row) => row.year}
        />
      </CardContent>
    </Card>
  );
}

const DEFAULT_VALUES = {
  PROPERTY_VALUE: "5000000",
  DOWN_PAYMENT_PERCENT: "20",
  INTEREST_RATE: "8.5",
  TENURE: "20",
  MONTHLY_RENT: "15000",
  RENT_INCREASE_RATE: "5",
  INVESTMENT_RETURN: "12",
  PROPERTY_APPRECIATION: "6",
  MAINTENANCE_PERCENT: "0.5",
} as const;

export default function RentVsBuyCalculator() {
  const [propertyValue, setPropertyValue] = useState<string>(DEFAULT_VALUES.PROPERTY_VALUE);
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>(DEFAULT_VALUES.DOWN_PAYMENT_PERCENT);
  const [interestRate, setInterestRate] = useState<string>(DEFAULT_VALUES.INTEREST_RATE);
  const [tenure, setTenure] = useState<string>(DEFAULT_VALUES.TENURE);
  const [monthlyRent, setMonthlyRent] = useState<string>(DEFAULT_VALUES.MONTHLY_RENT);
  const [rentIncreaseRate, setRentIncreaseRate] = useState<string>(DEFAULT_VALUES.RENT_INCREASE_RATE);
  const [investmentReturn, setInvestmentReturn] = useState<string>(DEFAULT_VALUES.INVESTMENT_RETURN);
  const [propertyAppreciation, setPropertyAppreciation] = useState<string>(DEFAULT_VALUES.PROPERTY_APPRECIATION);
  const [maintenancePercent, setMaintenancePercent] = useState<string>(DEFAULT_VALUES.MAINTENANCE_PERCENT);
  const [result, setResult] = useState<RentVsBuyResult | null>(null);

  // Clear results when any input value changes
  useEffect(() => {
    setResult(null);
  }, [propertyValue, downPaymentPercent, interestRate, tenure, monthlyRent, rentIncreaseRate, investmentReturn, propertyAppreciation, maintenancePercent]);

  const calculateScenarios = () => {
    const propValue = parseFloat(propertyValue);
    const downPayment = parseFloat(downPaymentPercent);
    const downPaymentAmount = propValue * (downPayment / 100);
    const loanAmount = propValue * (1 - downPayment / 100);
    const r = parseFloat(interestRate) / 12 / 100;
    const years = parseFloat(tenure);
    const n = years * 12;
    const initialRent = parseFloat(monthlyRent);
    const rentIncrease = parseFloat(rentIncreaseRate) / 100;
    const investReturn = parseFloat(investmentReturn) / 100;
    const propAppreciation = parseFloat(propertyAppreciation) / 100;
    const maintenance = parseFloat(maintenancePercent) / 100;

    if (
      isNaN(propValue) || isNaN(downPaymentAmount) || isNaN(loanAmount) || 
      isNaN(r) || isNaN(n) || isNaN(initialRent) || isNaN(rentIncrease) || 
      isNaN(investReturn) || isNaN(propAppreciation) || isNaN(maintenance) ||
      propValue <= 0 || r <= 0 || n <= 0
    ) {
      return;
    }

    // Calculate EMI
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const yearlyBreakdown = [];
    let totalRentPaid = 0;
    let investmentValue = downPaymentAmount; // Start with down payment invested
    let currentPropertyValue = propValue;
    let totalMaintenancePaid = 0;
    let totalEMIPaid = 0;
    let remainingLoan = loanAmount;

    for (let year = 1; year <= years; year++) {
      // Rent Scenario
      const currentMonthlyRent = initialRent * Math.pow(1 + rentIncrease, year - 1);
      const annualRent = currentMonthlyRent * 12;
      totalRentPaid += annualRent;

      // Investment grows: previous value + annual return + new contributions (EMI - rent difference if EMI > rent)
      const monthlyDifference = Math.max(0, emi - currentMonthlyRent);
      const annualNewInvestment = monthlyDifference * 12;
      investmentValue = investmentValue * (1 + investReturn) + annualNewInvestment;

      // Buy Scenario
      const annualEMI = emi * 12;
      totalEMIPaid += annualEMI;
      
      // Calculate principal paid this year (simplified)
      const principalPaid = Math.min(remainingLoan, annualEMI - (remainingLoan * r * 12));
      remainingLoan = Math.max(0, remainingLoan - principalPaid);
      
      currentPropertyValue = currentPropertyValue * (1 + propAppreciation);
      const annualMaintenance = currentPropertyValue * maintenance;
      totalMaintenancePaid += annualMaintenance;

      // Net worth calculations
      const netWorthRent = investmentValue - totalRentPaid;
      const netWorthBuy = currentPropertyValue - remainingLoan - totalMaintenancePaid;

      yearlyBreakdown.push({
        year,
        rentPaid: annualRent,
        investmentGrowth: investmentValue,
        emiPaid: annualEMI,
        propertyValue: currentPropertyValue,
        maintenancePaid: annualMaintenance,
        netWorthRent,
        netWorthBuy,
      });
    }

    const finalNetWorthRent = investmentValue - totalRentPaid;
    const finalNetWorthBuy = currentPropertyValue - remainingLoan - totalMaintenancePaid;
    const difference = finalNetWorthBuy - finalNetWorthRent;
    const betterOption = difference > 0 ? "buy" : "rent";

    setResult({
      totalRentPaid,
      investmentValue,
      totalRentCost: totalRentPaid - investmentValue,
      netWorthRent: finalNetWorthRent,
      totalEMIPaid,
      propertyValue: currentPropertyValue,
      totalMaintenancePaid,
      totalBuyCost: totalEMIPaid + totalMaintenancePaid,
      netWorthBuy: finalNetWorthBuy,
      difference,
      betterOption,
      yearlyBreakdown,
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
      <h1 className="text-4xl font-bold mb-6">Rent vs Buy Calculator</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Compare the financial outcomes of renting vs buying a property over time
      </p>

      <div className="space-y-6">
        <ScenarioInputs
          propertyValue={propertyValue}
          setPropertyValue={setPropertyValue}
          downPaymentPercent={downPaymentPercent}
          setDownPaymentPercent={setDownPaymentPercent}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          tenure={tenure}
          setTenure={setTenure}
          monthlyRent={monthlyRent}
          setMonthlyRent={setMonthlyRent}
          rentIncreaseRate={rentIncreaseRate}
          setRentIncreaseRate={setRentIncreaseRate}
          investmentReturn={investmentReturn}
          setInvestmentReturn={setInvestmentReturn}
          propertyAppreciation={propertyAppreciation}
          setPropertyAppreciation={setPropertyAppreciation}
          maintenancePercent={maintenancePercent}
          setMaintenancePercent={setMaintenancePercent}
          onCalculate={calculateScenarios}
        />

        {result && (
          <>
            <ResultsSummary result={result} tenure={tenure} formatCurrency={formatCurrency} />
            <YearlyBreakdownTable result={result} formatCurrency={formatCurrency} />
          </>
        )}
      </div>
    </div>
  );
}
