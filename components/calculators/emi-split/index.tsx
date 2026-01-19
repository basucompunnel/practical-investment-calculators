"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/common/FormField";
import { SummaryDataPoint } from "@/components/common/SummaryDataPoint";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";

interface EMIResult {
  emi: number;
  firstYearRent: number;
  firstYearOwnPocket: number;
  totalRentReceived: number;
  totalOwnPocket: number;
  totalEMIPaid: number;
  rentPercentage: number;
  ownPocketPercentage: number;
  breakEvenMonth: number | null;
  breakEvenYear: number | null;
  yearlyBreakdown: Array<{
    year: number;
    monthlyRent: number;
    yearlyRent: number;
    yearlyOwnPocket: number;
  }>;
}

interface LoanFormProps {
  propertyValue: string;
  setPropertyValue: (value: string) => void;
  downPaymentPercent: string;
  setDownPaymentPercent: (value: string) => void;
  interestRate: string;
  setInterestRate: (value: string) => void;
  tenure: string;
  setTenure: (value: string) => void;
  monthlyRent: string;
  setMonthlyRent: (value: string) => void;
  rentIncreaseRate: string;
  setRentIncreaseRate: (value: string) => void;
  onCalculate: () => void;
}

function LoanForm({
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
  onCalculate,
}: LoanFormProps) {
  const propValue = parseFloat(propertyValue) || 0;
  const downPayment = parseFloat(downPaymentPercent) || 0;
  const calculatedLoanAmount = propValue * (1 - downPayment / 100);

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl">Property Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
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
            <Label className="text-base">Loan Amount (calculated)</Label>
            <div className="h-12 flex items-center px-3 bg-muted rounded-none border text-base font-medium">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(calculatedLoanAmount)}
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
            label="Loan Tenure (years)"
            arrowStep={1}
            value={tenure}
            onChange={setTenure}
          />

          <FormField
            id="monthlyRent"
            label="Monthly Rent Received (₹)"
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
  result: EMIResult;
  tenure: string;
  formatCurrency: (value: number) => string;
}

function ResultsSummary({ result, tenure, formatCurrency }: ResultsSummaryProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl">Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryDataPoint
            label="Monthly EMI"
            value={formatCurrency(result.emi)}
            size="large"
          />

          <SummaryDataPoint
            label={`Total Loan Payment (Over ${tenure} years)`}
            value={formatCurrency(result.totalEMIPaid)}
          />

          {result.breakEvenYear !== null && (
            <SummaryDataPoint
              label="EMI Fully Covered by Rent From"
              value={`Year ${result.breakEvenYear}, Month ${result.breakEvenMonth}`}
            />
          )}

          <SummaryDataPoint
            label={`Total Rent Received (Over ${tenure} years)`}
            value={formatCurrency(result.totalRentReceived)}
          />

          <SummaryDataPoint
            label="Rent as % of Total EMI"
            value={`${result.rentPercentage.toFixed(1)}%`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface YearlyBreakdownTableProps {
  result: EMIResult;
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
      key: "monthlyRent",
      header: "Monthly Rent",
      align: "right",
      className: "text-green-600 font-medium",
      render: (value) => formatCurrency(value),
    },
    {
      key: "yearlyOwnPocket",
      header: "Monthly Own Payoff",
      align: "right",
      className: "text-orange-600 font-medium",
      render: (value, row) => formatCurrency(value / 12),
    },
    {
      key: "year",
      header: "Total Rent Collected",
      align: "right",
      className: "font-medium",
      render: (value, row) => {
        const cumulativeRent = result.yearlyBreakdown
          .slice(0, value)
          .reduce((sum, item) => sum + item.yearlyRent, 0);
        return formatCurrency(cumulativeRent);
      },
    },
    {
      key: "year",
      header: "Total Loan Paid",
      align: "right",
      className: "font-medium",
      render: (value, row) => {
        const totalLoanPaid = result.emi * 12 * value;
        return formatCurrency(totalLoanPaid);
      },
    },
    {
      key: "year",
      header: "% Paid by Rent",
      align: "right",
      className: "font-medium text-blue-600",
      render: (value, row) => {
        const percentage = Math.min((row.monthlyRent / result.emi) * 100, 100);
        return `${percentage.toFixed(1)}%`;
      },
    },
  ];

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl">Year-by-Year Breakdown</CardTitle>
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
  MONTHLY_RENT: "16667",
  RENT_INCREASE_RATE: "8",
  ANNUAL_RENT_PERCENTAGE: 0.03,
} as const;

export default function EMISplitCalculator() {
  const [propertyValue, setPropertyValue] = useState<string>(DEFAULT_VALUES.PROPERTY_VALUE);
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>(DEFAULT_VALUES.DOWN_PAYMENT_PERCENT);
  const [interestRate, setInterestRate] = useState<string>(DEFAULT_VALUES.INTEREST_RATE);
  const [tenure, setTenure] = useState<string>(DEFAULT_VALUES.TENURE);
  const [monthlyRent, setMonthlyRent] = useState<string>(DEFAULT_VALUES.MONTHLY_RENT);
  const [rentIncreaseRate, setRentIncreaseRate] = useState<string>(DEFAULT_VALUES.RENT_INCREASE_RATE);
  const [result, setResult] = useState<EMIResult | null>(null);

  // Update monthly rent dynamically based on property value (4% annually)
  useEffect(() => {
    const propValue = parseFloat(propertyValue) || 0;
    const calculatedMonthlyRent = (propValue * DEFAULT_VALUES.ANNUAL_RENT_PERCENTAGE) / 12;
    setMonthlyRent(Math.round(calculatedMonthlyRent).toString());
  }, [propertyValue]);

  // Clear results when any input value changes
  useEffect(() => {
    setResult(null);
  }, [propertyValue, downPaymentPercent, interestRate, tenure, monthlyRent, rentIncreaseRate]);

  const calculateEMI = () => {
    const propValue = parseFloat(propertyValue);
    const downPayment = parseFloat(downPaymentPercent);
    const P = propValue * (1 - downPayment / 100);
    const r = parseFloat(interestRate) / 12 / 100;
    const years = parseFloat(tenure);
    const n = years * 12;
    const initialRent = parseFloat(monthlyRent);
    const rentIncrease = parseFloat(rentIncreaseRate) / 100;

    if (isNaN(P) || isNaN(r) || isNaN(n) || isNaN(initialRent) || isNaN(rentIncrease) || P <= 0 || r <= 0 || n <= 0 || isNaN(propValue) || propValue <= 0) {
      return;
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    // Calculate year-by-year breakdown and find break-even point
    const yearlyBreakdown = [];
    let totalRentReceived = 0;
    let totalOwnPocket = 0;
    let breakEvenMonth = null;
    let breakEvenYear = null;

    for (let year = 1; year <= years; year++) {
      const currentMonthlyRent = initialRent * Math.pow(1 + rentIncrease, year - 1);
      
      // Check if this is the break-even point (first time rent >= EMI)
      if (breakEvenMonth === null && currentMonthlyRent >= emi) {
        breakEvenYear = year;
        breakEvenMonth = 1;
      }
      
      const rentContribution = Math.min(currentMonthlyRent, emi);
      const ownPocketMonth = Math.max(0, emi - currentMonthlyRent);
      
      const yearlyRent = rentContribution * 12;
      const yearlyOwnPocket = ownPocketMonth * 12;
      
      totalRentReceived += yearlyRent;
      totalOwnPocket += yearlyOwnPocket;
      
      yearlyBreakdown.push({
        year,
        monthlyRent: currentMonthlyRent,
        yearlyRent,
        yearlyOwnPocket,
      });
    }

    const firstYearRent = Math.min(initialRent, emi);
    const firstYearOwnPocket = Math.max(0, emi - initialRent);
    
    const totalEMIPaid = emi * 12 * years;
    const rentPercentage = (totalRentReceived / totalEMIPaid) * 100;
    const ownPocketPercentage = (totalOwnPocket / totalEMIPaid) * 100;

    setResult({
      emi,
      firstYearRent,
      firstYearOwnPocket,
      totalRentReceived,
      totalOwnPocket,
      totalEMIPaid,
      rentPercentage,
      ownPocketPercentage,
      breakEvenMonth,
      breakEvenYear,
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
      <h1 className="text-4xl font-bold mb-6">EMI Split Calculator</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Calculate how much of your EMI is paid by rent vs your own pocket
      </p>

      <div className="space-y-6">
        <LoanForm
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
          onCalculate={calculateEMI}
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
