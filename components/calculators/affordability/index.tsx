"use client";

import { useState, useEffect } from "react";
import { TabSelector } from "@/components/common/TabSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { SummaryDataPoint } from "@/components/common/SummaryDataPoint";
import { DataTable } from "@/components/common/DataTable";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type LoanType = "car" | "home" | "phone" | "education" | "personal" | "bike";

interface CarLoanResult {
  carPrice: number;
  loanAmount: number;
  downPayment: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  totalCost: number;
  suggestedIncomeMin: number;
  suggestedIncomeMax: number;
  yearlyBreakdown: Array<{
    year: number;
    openingBalance: number;
    principalPaid: number;
    interestPaid: number;
    closingBalance: number;
  }>;
}

interface HomeLoanResult {
  homePrice: number;
  loanAmount: number;
  downPayment: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  totalCost: number;
  suggestedIncomeMin: number;
  suggestedIncomeMax: number;
  yearlyBreakdown: Array<{
    year: number;
    openingBalance: number;
    principalPaid: number;
    interestPaid: number;
    closingBalance: number;
  }>;
}

interface PhoneLoanResult {
  phonePrice: number;
  loanAmount: number;
  downPayment: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  totalCost: number;
  suggestedIncomeMin: number;
  suggestedIncomeMax: number;
  yearlyBreakdown: Array<{
    year: number;
    openingBalance: number;
    principalPaid: number;
    interestPaid: number;
    closingBalance: number;
  }>;
}

interface EducationLoanResult {
  educationCost: number;
  loanAmount: number;
  downPayment: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  totalCost: number;
  suggestedIncomeMin: number;
  suggestedIncomeMax: number;
  yearlyBreakdown: Array<{
    year: number;
    openingBalance: number;
    principalPaid: number;
    interestPaid: number;
    closingBalance: number;
  }>;
}

interface PersonalLoanResult {
  loanAmount: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  suggestedIncomeMin: number;
  suggestedIncomeMax: number;
  yearlyBreakdown: Array<{
    year: number;
    openingBalance: number;
    principalPaid: number;
    interestPaid: number;
    closingBalance: number;
  }>;
}

interface BikeLoanResult {
  bikePrice: number;
  loanAmount: number;
  downPayment: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  totalCost: number;
  suggestedIncomeMin: number;
  suggestedIncomeMax: number;
  yearlyBreakdown: Array<{
    year: number;
    openingBalance: number;
    principalPaid: number;
    interestPaid: number;
    closingBalance: number;
  }>;
}

const loanTypeInfo = {
  car: {
    title: "Car Affordability",
    description: "Calculate monthly EMI and total cost for your car loan",
  },
  home: {
    title: "Home Affordability",
    description: "Calculate how much home you can afford based on your income",
  },
  phone: {
    title: "Phone Affordability",
    description: "Calculate how much phone you can afford based on your income",
  },
  education: {
    title: "Education Loan",
    description: "Calculate EMI and total cost for your education loan",
  },
  personal: {
    title: "Personal Loan",
    description: "Calculate EMI and total cost for your personal loan",
  },
  bike: {
    title: "Two-Wheeler Loan",
    description: "Calculate monthly EMI and total cost for your bike loan",
  },
};

const LOAN_TYPE_OPTIONS = [
  { value: "home", label: "Home" },
  { value: "car", label: "Car" },
  { value: "education", label: "Education" },
  { value: "personal", label: "Personal" },
  { value: "bike", label: "Bike" },
  { value: "phone", label: "Phone" },
];

// Default values and constants
type LoanBase = {
  principal: number;
  loanPercentage?: number;
  interestRate: number;
  tenure: number;
  step: number;
  incomeRatioAggressive: number;
  incomeRatioConservative: number;
};

const DEFAULTS = {
  home: {
    principal: 5_000_000,
    loanPercentage: 80,
    interestRate: 8.5,
    tenure: 20,
    step: 100_000,
    incomeRatioAggressive: 0.45,
    incomeRatioConservative: 0.30,
  },

  car: {
    principal: 1_000_000,
    loanPercentage: 80,
    interestRate: 8.5,
    tenure: 5,
    step: 50_000,
    incomeRatioAggressive: 0.40,
    incomeRatioConservative: 0.30,
  },

  bike: {
    principal: 150_000,
    loanPercentage: 90,
    interestRate: 10,
    tenure: 3,
    step: 10_000,
    incomeRatioAggressive: 0.15,
    incomeRatioConservative: 0.1,
  },

  education: {
    principal: 500_000,
    loanPercentage: 90,
    interestRate: 9.5,
    tenure: 10,
    step: 50_000,
    incomeRatioAggressive: 0.35,
    incomeRatioConservative: 0.25,
  },

  personal: {
    principal: 300_000,
    interestRate: 14,
    tenure: 3,
    step: 25_000,
    incomeRatioAggressive: 0.30,
    incomeRatioConservative: 0.20,
  },

  phone: {
    principal: 100_000,
    loanPercentage: 100,
    interestRate: 0,
    tenure: 1,
    step: 10_000,
    incomeRatioAggressive: 0.15,
    incomeRatioConservative: 0.10,
  },
} as const satisfies Record<string, LoanBase>;

const CALCULATION_CONSTANTS = {
  monthsPerYear: 12,
  loanPercentageStep: 5,
  interestRateStep: 0.5,
  tenureStep: 1,
} as const;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

// Car Input Form Component
interface CarInputFormProps {
  carPrice: string;
  setCarPrice: (value: string) => void;
  loanPercentage: string;
  setLoanPercentage: (value: string) => void;
  interestRate: string;
  setInterestRate: (value: string) => void;
  loanTenure: string;
  setLoanTenure: (value: string) => void;
  onCalculate: () => void;
}

function CarInputForm({
  carPrice,
  setCarPrice,
  loanPercentage,
  setLoanPercentage,
  interestRate,
  setInterestRate,
  loanTenure,
  setLoanTenure,
  onCalculate,
}: CarInputFormProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl">Car Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
            id="carPrice"
            label="Price of Car (₹)"
            arrowStep={DEFAULTS.car.step}
            value={carPrice}
            onChange={setCarPrice}
          />
          <FormField
            id="loanPercentage"
            label="Loan Percentage (%)"
            step="1"
            arrowStep={CALCULATION_CONSTANTS.loanPercentageStep}
            value={loanPercentage}
            onChange={setLoanPercentage}
          />
          <FormField
            id="interestRate"
            label="Interest Rate (% p.a.)"
            step="0.1"
            arrowStep={CALCULATION_CONSTANTS.interestRateStep}
            value={interestRate}
            onChange={setInterestRate}
          />
          <FormField
            id="loanTenure"
            label="Loan Tenure (years)"
            arrowStep={CALCULATION_CONSTANTS.tenureStep}
            value={loanTenure}
            onChange={setLoanTenure}
          />
        </div>

        <Button
          onClick={onCalculate}
          className="group relative w-full overflow-hidden rounded-none h-12 text-base"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Calculate</span>
        </Button>
      </CardContent>
    </Card>
  );
}

// Generic Summary Cards Component
interface GenericSummaryCardsProps {
  result: {
    loanAmount: number;
    monthlyEMI: number;
    totalInterest: number;
    totalPayable: number;
    suggestedIncomeMin: number;
    suggestedIncomeMax: number;
  } & (
    | { itemPrice: number; downPayment: number; totalCost: number; itemLabel: string }
    | { itemPrice?: never; downPayment?: never; totalCost?: never; itemLabel?: never }
  );
  loanTenure: string;
  interestRate: string;
}

function GenericSummaryCards({ result, loanTenure, interestRate }: GenericSummaryCardsProps) {
  const hasItemPrice = 'itemPrice' in result && result.itemPrice !== undefined;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {hasItemPrice ? (
        <Card className="rounded-none">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg">{result.itemLabel} & Down Payment</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <SummaryDataPoint
                label={result.itemLabel}
                value={formatCurrency(result.itemPrice)}
              />
              <SummaryDataPoint
                label="Loan Amount"
                value={formatCurrency(result.loanAmount)}
              />
              <SummaryDataPoint
                label="Down Payment"
                value={formatCurrency(result.downPayment!)}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-none">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg">Loan Amount</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <SummaryDataPoint
                label="Loan Amount"
                value={formatCurrency(result.loanAmount)}
                size="large"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-none border-2 border-primary">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-lg">Monthly Payment</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <SummaryDataPoint
              label="Monthly EMI"
              value={formatCurrency(result.monthlyEMI)}
              size="large"
            />
            <SummaryDataPoint
              label="Suggested Income Range"
              value={`${formatCurrency(result.suggestedIncomeMin)} - ${formatCurrency(result.suggestedIncomeMax)}`}
            />
            <SummaryDataPoint label="Tenure" value={`${loanTenure} years`} />
            <SummaryDataPoint
              label="Interest Rate"
              value={`${interestRate}% p.a.`}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-lg">Total Cost</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <SummaryDataPoint
              label="Total Interest"
              value={formatCurrency(result.totalInterest)}
            />
            <SummaryDataPoint
              label="Total Payable"
              value={formatCurrency(result.totalPayable)}
            />
            {hasItemPrice && (
              <SummaryDataPoint
                label={`Total Cost of ${result.itemLabel}`}
                value={formatCurrency(result.totalCost!)}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Generic Payment Breakdown Component
interface GenericPaymentBreakdownProps {
  result: {
    loanAmount: number;
    totalInterest: number;
    totalPayable: number;
  } & (
    | { itemPrice: number; downPayment: number }
    | { itemPrice?: never; downPayment?: never }
  );
}

function GenericPaymentBreakdown({ result }: GenericPaymentBreakdownProps) {
  const hasItemPrice = 'itemPrice' in result && result.itemPrice !== undefined;
  
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl">Payment Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className={`grid grid-cols-1 ${hasItemPrice ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-8`}>
          {hasItemPrice && (
            <div>
              <div className="text-sm font-semibold mb-4">
                Down Payment vs Loan Amount
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                    <span className="text-sm">Down Payment</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(result.downPayment!)} (
                    {((result.downPayment! / result.itemPrice!) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                    <span className="text-sm">Loan Amount</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(result.loanAmount)} (
                    {((result.loanAmount / result.itemPrice!) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="mt-4 h-4 flex rounded-none overflow-hidden">
                <div
                  className="bg-green-600"
                  style={{
                    width: `${(result.downPayment! / result.itemPrice!) * 100}%`,
                  }}
                ></div>
                <div
                  className="bg-blue-600"
                  style={{
                    width: `${(result.loanAmount / result.itemPrice!) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          <div>
            <div className="text-sm font-semibold mb-4">
              Principal vs Interest
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
                  <span className="text-sm">Principal</span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(result.loanAmount)} (
                  {((result.loanAmount / result.totalPayable) * 100).toFixed(1)}
                  %)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-600 rounded-sm"></div>
                  <span className="text-sm">Interest</span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(result.totalInterest)} (
                  {((result.totalInterest / result.totalPayable) * 100).toFixed(
                    1,
                  )}
                  %)
                </span>
              </div>
            </div>
            <div className="mt-4 h-4 flex rounded-none overflow-hidden">
              <div
                className="bg-purple-600"
                style={{
                  width: `${(result.loanAmount / result.totalPayable) * 100}%`,
                }}
              ></div>
              <div
                className="bg-orange-600"
                style={{
                  width: `${(result.totalInterest / result.totalPayable) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Loan Amortization Chart Component
interface LoanAmortizationChartProps {
  data: Array<{
    year: number;
    openingBalance: number;
    principalPaid: number;
    interestPaid: number;
    closingBalance: number;
  }>;
}

function LoanAmortizationChart({ data }: LoanAmortizationChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="year" 
            label={{ value: 'Year', position: 'insideBottom', offset: -10 }}
            className="text-sm"
          />
          <YAxis 
            label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
            className="text-sm"
          />
          <Tooltip 
            formatter={(value) => value ? formatCurrency(Number(value)) : ''}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />
          <Bar 
            dataKey="principalPaid" 
            stackId="a" 
            fill="#9333ea" 
            name="Principal Paid"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="interestPaid" 
            stackId="a" 
            fill="#ea580c" 
            name="Interest Paid"
            radius={[4, 4, 0, 0]}
          />
          <Line 
            type="monotone" 
            dataKey="closingBalance" 
            stroke="#2563eb" 
            strokeWidth={2}
            name="Closing Balance"
            dot={{ fill: '#2563eb', r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// Generic Year-by-Year Breakdown Component
interface GenericYearlyBreakdownProps {
  result: {
    yearlyBreakdown: Array<{
      year: number;
      openingBalance: number;
      principalPaid: number;
      interestPaid: number;
      closingBalance: number;
    }>;
  };
}

function GenericYearlyBreakdown({ result }: GenericYearlyBreakdownProps) {
  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="text-2xl">Year-by-Year Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {/* Combo Chart */}
        <LoanAmortizationChart data={result.yearlyBreakdown} />

        {/* Data Table */}
        <DataTable
          data={result.yearlyBreakdown}
          columns={[
            { key: "year", header: "Year", align: "left" },
            {
              key: "openingBalance",
              header: "Opening Balance",
              align: "right",
              render: (value) => formatCurrency(value as number),
            },
            {
              key: "principalPaid",
              header: "Principal Paid",
              align: "right",
              className: "text-purple-600 font-medium",
              render: (value) => formatCurrency(value as number),
            },
            {
              key: "interestPaid",
              header: "Interest Paid",
              align: "right",
              className: "text-orange-600 font-medium",
              render: (value) => formatCurrency(value as number),
            },
            {
              key: "closingBalance",
              header: "Closing Balance",
              align: "right",
              render: (value) => formatCurrency(value as number),
            },
          ]}
          getRowKey={(row) => row.year}
        />
      </CardContent>
    </Card>
  );
}

// Car Affordability Calculator Component
function CarAffordabilityCalculator() {
  const [carPrice, setCarPrice] = useState<string>(String(DEFAULTS.car.principal));
  const [loanPercentage, setLoanPercentage] = useState<string>(String(DEFAULTS.car.loanPercentage));
  const [interestRate, setInterestRate] = useState<string>(String(DEFAULTS.car.interestRate));
  const [loanTenure, setLoanTenure] = useState<string>(String(DEFAULTS.car.tenure));

  const [result, setResult] = useState<CarLoanResult | null>(null);

  // Reset results when inputs change
  useEffect(() => {
    setResult(null);
  }, [carPrice, loanPercentage, interestRate, loanTenure]);

  const calculateCarLoan = () => {
    const price = parseFloat(carPrice);
    const loanPercent = parseFloat(loanPercentage) / 100;
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);

    const loanAmount = price * loanPercent;
    const downPayment = price - loanAmount;
    const monthlyRate = rate / 12;
    const months = tenure * 12;

    // EMI calculation: P Ã— r Ã— (1 + r)^n / [(1 + r)^n - 1]
    const monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayable = monthlyEMI * months;
    const totalInterest = totalPayable - loanAmount;
    const totalCost = downPayment + totalPayable;

    // Suggested income range (EMI should be 40-50% of monthly income)
    const suggestedIncomeMin = monthlyEMI / DEFAULTS.car.incomeRatioAggressive; // Aggressive (50% of income)
    const suggestedIncomeMax = monthlyEMI / DEFAULTS.car.incomeRatioConservative; // Conservative (40% of income)

    // Year-by-year breakdown
    const yearlyBreakdown = [];
    let remainingBalance = loanAmount;

    for (let year = 1; year <= tenure; year++) {
      const openingBalance = remainingBalance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      // Calculate for 12 months
      for (let month = 1; month <= CALCULATION_CONSTANTS.monthsPerYear; month++) {
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = monthlyEMI - interestForMonth;

        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingBalance -= principalForMonth;
      }

      yearlyBreakdown.push({
        year,
        openingBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        closingBalance: Math.max(0, remainingBalance),
      });
    }

    setResult({
      carPrice: price,
      loanAmount,
      downPayment,
      suggestedIncomeMin,
      suggestedIncomeMax,
      monthlyEMI,
      totalInterest,
      totalPayable,
      totalCost,
      yearlyBreakdown,
    });
  };

  return (
    <>
      <CarInputForm
        carPrice={carPrice}
        setCarPrice={setCarPrice}
        loanPercentage={loanPercentage}
        setLoanPercentage={setLoanPercentage}
        interestRate={interestRate}
        setInterestRate={setInterestRate}
        loanTenure={loanTenure}
        setLoanTenure={setLoanTenure}
        onCalculate={calculateCarLoan}
      />

      {result && (
        <div className="space-y-6 mt-6">
          <GenericSummaryCards
            result={{
              ...result,
              itemPrice: result.carPrice,
              itemLabel: "Car Price",
            }}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />
          <GenericPaymentBreakdown result={{ ...result, itemPrice: result.carPrice }} />
          <GenericYearlyBreakdown result={result} />
        </div>
      )}
    </>
  );
}

// Home Affordability Calculator Component
function HomeAffordabilityCalculator() {
  const [homePrice, setHomePrice] = useState<string>(String(DEFAULTS.home.principal));
  const [loanPercentage, setLoanPercentage] = useState<string>(String(DEFAULTS.home.loanPercentage));
  const [interestRate, setInterestRate] = useState<string>(String(DEFAULTS.home.interestRate));
  const [loanTenure, setLoanTenure] = useState<string>(String(DEFAULTS.home.tenure));
  const [result, setResult] = useState<HomeLoanResult | null>(null);

  useEffect(() => {
    setResult(null);
  }, [homePrice, loanPercentage, interestRate, loanTenure]);

  const calculateHomeLoan = () => {
    const price = parseFloat(homePrice);
    const loanPercent = parseFloat(loanPercentage) / 100;
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);
    const loanAmount = price * loanPercent;
    const downPayment = price - loanAmount;
    const monthlyRate = rate / CALCULATION_CONSTANTS.monthsPerYear;
    const months = tenure * CALCULATION_CONSTANTS.monthsPerYear;
    const monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayable = monthlyEMI * months;
    const totalInterest = totalPayable - loanAmount;
    const totalCost = downPayment + totalPayable;
    const suggestedIncomeMin = monthlyEMI / DEFAULTS.home.incomeRatioAggressive;
    const suggestedIncomeMax = monthlyEMI / DEFAULTS.home.incomeRatioConservative;
    const yearlyBreakdown = [];
    let remainingBalance = loanAmount;

    for (let year = 1; year <= tenure; year++) {
      const openingBalance = remainingBalance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 1; month <= CALCULATION_CONSTANTS.monthsPerYear; month++) {
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = monthlyEMI - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingBalance -= principalForMonth;
      }
      yearlyBreakdown.push({
        year,
        openingBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        closingBalance: Math.max(0, remainingBalance),
      });
    }

    setResult({
      homePrice: price,
      loanAmount,
      downPayment,
      suggestedIncomeMin,
      suggestedIncomeMax,
      monthlyEMI,
      totalInterest,
      totalPayable,
      totalCost,
      yearlyBreakdown,
    });
  };

  return (
    <>
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-2xl">Home Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              id="homePrice"
              label="Price of Home (₹)"
              arrowStep={DEFAULTS.home.step}
              value={homePrice}
              onChange={setHomePrice}
            />
            <FormField
              id="loanPercentage"
              label="Loan Percentage (%)"
              step="1"
              arrowStep={CALCULATION_CONSTANTS.loanPercentageStep}
              value={loanPercentage}
              onChange={setLoanPercentage}
            />
            <FormField
              id="interestRate"
              label="Interest Rate (% p.a.)"
              step="0.1"
              arrowStep={CALCULATION_CONSTANTS.interestRateStep}
              value={interestRate}
              onChange={setInterestRate}
            />
            <FormField
              id="loanTenure"
              label="Loan Tenure (years)"
              arrowStep={CALCULATION_CONSTANTS.tenureStep}
              value={loanTenure}
              onChange={setLoanTenure}
            />
          </div>
          <Button
            onClick={calculateHomeLoan}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate</span>
          </Button>
        </CardContent>
      </Card>
      {result && (
        <div className="space-y-6 mt-6">
          <GenericSummaryCards
            result={{
              ...result,
              itemPrice: result.homePrice,
              itemLabel: "Home Price",
            }}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />
          <GenericPaymentBreakdown result={{ ...result, itemPrice: result.homePrice }} />
          <GenericYearlyBreakdown result={result} />
        </div>
      )}
    </>
  );
}

// PhoneAffordabilityCalculator
function PhoneAffordabilityCalculator() {
  const [phonePrice, setPhonePrice] = useState<string>(String(DEFAULTS.phone.principal));
  const [loanPercentage, setLoanPercentage] = useState<string>(String(DEFAULTS.phone.loanPercentage));
  const [interestRate, setInterestRate] = useState<string>(String(DEFAULTS.phone.interestRate));
  const [loanTenure, setLoanTenure] = useState<string>(String(DEFAULTS.phone.tenure));
  const [result, setResult] = useState<PhoneLoanResult | null>(null);

  useEffect(() => {
    setResult(null);
  }, [phonePrice, loanPercentage, interestRate, loanTenure]);

  const calculatePhoneLoan = () => {
    const price = parseFloat(phonePrice);
    const loanPercent = parseFloat(loanPercentage) / 100;
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);
    const loanAmount = price * loanPercent;
    const downPayment = price - loanAmount;
    const monthlyRate = rate / CALCULATION_CONSTANTS.monthsPerYear;
    const months = tenure * CALCULATION_CONSTANTS.monthsPerYear;
    let monthlyEMI;
    if (rate === 0) {
      monthlyEMI = loanAmount / months;
    } else {
      monthlyEMI =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }
    const totalPayable = monthlyEMI * months;
    const totalInterest = totalPayable - loanAmount;
    const totalCost = downPayment + totalPayable;
    const suggestedIncomeMin = monthlyEMI / DEFAULTS.phone.incomeRatioAggressive;
    const suggestedIncomeMax = monthlyEMI / DEFAULTS.phone.incomeRatioConservative;
    const yearlyBreakdown = [];
    let remainingBalance = loanAmount;

    for (let year = 1; year <= tenure; year++) {
      const openingBalance = remainingBalance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 1; month <= CALCULATION_CONSTANTS.monthsPerYear; month++) {
        if (remainingBalance <= 0) break;
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = monthlyEMI - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingBalance -= principalForMonth;
      }
      yearlyBreakdown.push({
        year,
        openingBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        closingBalance: Math.max(0, remainingBalance),
      });
    }

    setResult({
      phonePrice: price,
      loanAmount,
      downPayment,
      suggestedIncomeMin,
      suggestedIncomeMax,
      monthlyEMI,
      totalInterest,
      totalPayable,
      totalCost,
      yearlyBreakdown,
    });
  };

  return (
    <>
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-2xl">Phone Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              id="phonePrice"
              label="Price of Phone (₹)"
              arrowStep={DEFAULTS.phone.step}
              value={phonePrice}
              onChange={setPhonePrice}
            />
            <FormField
              id="loanPercentage"
              label="Loan Percentage (%)"
              step="1"
              arrowStep={CALCULATION_CONSTANTS.loanPercentageStep}
              value={loanPercentage}
              onChange={setLoanPercentage}
            />
            <FormField
              id="interestRate"
              label="Interest Rate (% p.a.)"
              step="0.1"
              arrowStep={CALCULATION_CONSTANTS.interestRateStep}
              value={interestRate}
              onChange={setInterestRate}
            />
            <FormField
              id="loanTenure"
              label="Loan Tenure (years)"
              arrowStep={CALCULATION_CONSTANTS.tenureStep}
              value={loanTenure}
              onChange={setLoanTenure}
            />
          </div>
          <Button
            onClick={calculatePhoneLoan}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate</span>
          </Button>
        </CardContent>
      </Card>
      {result && (
        <div className="space-y-6 mt-6">
          <GenericSummaryCards
            result={{
              ...result,
              itemPrice: result.phonePrice,
              itemLabel: "Phone Price",
            }}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />
          <GenericPaymentBreakdown result={{ ...result, itemPrice: result.phonePrice }} />
          <GenericYearlyBreakdown result={result} />
        </div>
      )}
    </>
  );
}

// EducationLoanCalculator
function EducationLoanCalculator() {
  const [educationCost, setEducationCost] = useState<string>(String(DEFAULTS.education.principal));
  const [loanPercentage, setLoanPercentage] = useState<string>(String(DEFAULTS.education.loanPercentage));
  const [interestRate, setInterestRate] = useState<string>(String(DEFAULTS.education.interestRate));
  const [loanTenure, setLoanTenure] = useState<string>(String(DEFAULTS.education.tenure));
  const [result, setResult] = useState<EducationLoanResult | null>(null);

  useEffect(() => {
    setResult(null);
  }, [educationCost, loanPercentage, interestRate, loanTenure]);

  const calculateEducationLoan = () => {
    const price = parseFloat(educationCost);
    const loanPercent = parseFloat(loanPercentage) / 100;
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);
    const loanAmount = price * loanPercent;
    const downPayment = price - loanAmount;
    const monthlyRate = rate / CALCULATION_CONSTANTS.monthsPerYear;
    const months = tenure * CALCULATION_CONSTANTS.monthsPerYear;
    const monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayable = monthlyEMI * months;
    const totalInterest = totalPayable - loanAmount;
    const totalCost = downPayment + totalPayable;
    const suggestedIncomeMin = monthlyEMI / DEFAULTS.education.incomeRatioAggressive;
    const suggestedIncomeMax = monthlyEMI / DEFAULTS.education.incomeRatioConservative;
    const yearlyBreakdown = [];
    let remainingBalance = loanAmount;

    for (let year = 1; year <= tenure; year++) {
      const openingBalance = remainingBalance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 1; month <= CALCULATION_CONSTANTS.monthsPerYear; month++) {
        if (remainingBalance <= 0) break;
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = monthlyEMI - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingBalance -= principalForMonth;
      }
      yearlyBreakdown.push({
        year,
        openingBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        closingBalance: Math.max(0, remainingBalance),
      });
    }

    setResult({
      educationCost: price,
      loanAmount,
      downPayment,
      suggestedIncomeMin,
      suggestedIncomeMax,
      monthlyEMI,
      totalInterest,
      totalPayable,
      totalCost,
      yearlyBreakdown,
    });
  };

  return (
    <>
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-2xl">Education Loan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              id="educationCost"
              label="Education Cost (₹)"
              arrowStep={DEFAULTS.education.step}
              value={educationCost}
              onChange={setEducationCost}
            />
            <FormField
              id="loanPercentage"
              label="Loan Percentage (%)"
              step="1"
              arrowStep={CALCULATION_CONSTANTS.loanPercentageStep}
              value={loanPercentage}
              onChange={setLoanPercentage}
            />
            <FormField
              id="interestRate"
              label="Interest Rate (% p.a.)"
              step="0.1"
              arrowStep={CALCULATION_CONSTANTS.interestRateStep}
              value={interestRate}
              onChange={setInterestRate}
            />
            <FormField
              id="loanTenure"
              label="Loan Tenure (years)"
              arrowStep={CALCULATION_CONSTANTS.tenureStep}
              value={loanTenure}
              onChange={setLoanTenure}
            />
          </div>
          <Button
            onClick={calculateEducationLoan}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate</span>
          </Button>
        </CardContent>
      </Card>
      {result && (
        <div className="space-y-6 mt-6">
          <GenericSummaryCards
            result={{
              ...result,
              itemPrice: result.educationCost,
              itemLabel: "Education Cost",
            }}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />
          <GenericPaymentBreakdown result={{ ...result, itemPrice: result.educationCost }} />
          <GenericYearlyBreakdown result={result} />
        </div>
      )}
    </>
  );
}

// PersonalLoanCalculator
function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>(String(DEFAULTS.personal.principal));
  const [interestRate, setInterestRate] = useState<string>(String(DEFAULTS.personal.interestRate));
  const [loanTenure, setLoanTenure] = useState<string>(String(DEFAULTS.personal.tenure));
  const [result, setResult] = useState<PersonalLoanResult | null>(null);

  useEffect(() => {
    setResult(null);
  }, [loanAmount, interestRate, loanTenure]);

  const calculatePersonalLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);
    const monthlyRate = rate / CALCULATION_CONSTANTS.monthsPerYear;
    const months = tenure * CALCULATION_CONSTANTS.monthsPerYear;
    const monthlyEMI =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayable = monthlyEMI * months;
    const totalInterest = totalPayable - principal;
    const suggestedIncomeMin = monthlyEMI / DEFAULTS.personal.incomeRatioAggressive;
    const suggestedIncomeMax = monthlyEMI / DEFAULTS.personal.incomeRatioConservative;
    const yearlyBreakdown = [];
    let remainingBalance = principal;

    for (let year = 1; year <= tenure; year++) {
      const openingBalance = remainingBalance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 1; month <= CALCULATION_CONSTANTS.monthsPerYear; month++) {
        if (remainingBalance <= 0) break;
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = monthlyEMI - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingBalance -= principalForMonth;
      }
      yearlyBreakdown.push({
        year,
        openingBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        closingBalance: Math.max(0, remainingBalance),
      });
    }

    setResult({
      loanAmount: principal,
      suggestedIncomeMin,
      suggestedIncomeMax,
      monthlyEMI,
      totalInterest,
      totalPayable,
      yearlyBreakdown,
    });
  };

  return (
    <>
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-2xl">Personal Loan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              id="loanAmount"
              label="Loan Amount (₹)"
              arrowStep={DEFAULTS.personal.step}
              value={loanAmount}
              onChange={setLoanAmount}
            />
            <FormField
              id="interestRate"
              label="Interest Rate (% p.a.)"
              step="0.1"
              arrowStep={CALCULATION_CONSTANTS.interestRateStep}
              value={interestRate}
              onChange={setInterestRate}
            />
            <FormField
              id="loanTenure"
              label="Loan Tenure (years)"
              arrowStep={CALCULATION_CONSTANTS.tenureStep}
              value={loanTenure}
              onChange={setLoanTenure}
            />
          </div>
          <Button
            onClick={calculatePersonalLoan}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate</span>
          </Button>
        </CardContent>
      </Card>
      {result && (
        <div className="space-y-6 mt-6">
          <GenericSummaryCards
            result={result}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />
          <GenericPaymentBreakdown result={result} />
          <GenericYearlyBreakdown result={result} />
        </div>
      )}
    </>
  );
}

// BikeLoanCalculator
function BikeLoanCalculator() {
  const [bikePrice, setBikePrice] = useState<string>(String(DEFAULTS.bike.principal));
  const [loanPercentage, setLoanPercentage] = useState<string>(String(DEFAULTS.bike.loanPercentage));
  const [interestRate, setInterestRate] = useState<string>(String(DEFAULTS.bike.interestRate));
  const [loanTenure, setLoanTenure] = useState<string>(String(DEFAULTS.bike.tenure));
  const [result, setResult] = useState<BikeLoanResult | null>(null);

  useEffect(() => {
    setResult(null);
  }, [bikePrice, loanPercentage, interestRate, loanTenure]);

  const calculateBikeLoan = () => {
    const price = parseFloat(bikePrice);
    const loanPercent = parseFloat(loanPercentage) / 100;
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);
    const loanAmount = price * loanPercent;
    const downPayment = price - loanAmount;
    const monthlyRate = rate / CALCULATION_CONSTANTS.monthsPerYear;
    const months = tenure * CALCULATION_CONSTANTS.monthsPerYear;
    const monthlyEMI =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayable = monthlyEMI * months;
    const totalInterest = totalPayable - loanAmount;
    const totalCost = downPayment + totalPayable;
    const suggestedIncomeMin = monthlyEMI / DEFAULTS.bike.incomeRatioAggressive;
    const suggestedIncomeMax = monthlyEMI / DEFAULTS.bike.incomeRatioConservative;
    const yearlyBreakdown = [];
    let remainingBalance = loanAmount;

    for (let year = 1; year <= tenure; year++) {
      const openingBalance = remainingBalance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      for (let month = 1; month <= CALCULATION_CONSTANTS.monthsPerYear; month++) {
        if (remainingBalance <= 0) break;
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = monthlyEMI - interestForMonth;
        yearlyInterest += interestForMonth;
        yearlyPrincipal += principalForMonth;
        remainingBalance -= principalForMonth;
      }
      yearlyBreakdown.push({
        year,
        openingBalance,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        closingBalance: Math.max(0, remainingBalance),
      });
    }

    setResult({
      bikePrice: price,
      loanAmount,
      downPayment,
      suggestedIncomeMin,
      suggestedIncomeMax,
      monthlyEMI,
      totalInterest,
      totalPayable,
      totalCost,
      yearlyBreakdown,
    });
  };

  return (
    <>
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle className="text-2xl">Two-Wheeler Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              id="bikePrice"
              label="Price of Bike (₹)"
              arrowStep={DEFAULTS.bike.step}
              value={bikePrice}
              onChange={setBikePrice}
            />
            <FormField
              id="loanPercentage"
              label="Loan Percentage (%)"
              step="1"
              arrowStep={CALCULATION_CONSTANTS.loanPercentageStep}
              value={loanPercentage}
              onChange={setLoanPercentage}
            />
            <FormField
              id="interestRate"
              label="Interest Rate (% p.a.)"
              step="0.1"
              arrowStep={CALCULATION_CONSTANTS.interestRateStep}
              value={interestRate}
              onChange={setInterestRate}
            />
            <FormField
              id="loanTenure"
              label="Loan Tenure (years)"
              arrowStep={CALCULATION_CONSTANTS.tenureStep}
              value={loanTenure}
              onChange={setLoanTenure}
            />
          </div>
          <Button
            onClick={calculateBikeLoan}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate</span>
          </Button>
        </CardContent>
      </Card>
      {result && (
        <div className="space-y-6 mt-6">
          <GenericSummaryCards
            result={{
              ...result,
              itemPrice: result.bikePrice,
              itemLabel: "Bike Price",
            }}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />
          <GenericPaymentBreakdown result={{ ...result, itemPrice: result.bikePrice }} />
          <GenericYearlyBreakdown result={result} />
        </div>
      )}
    </>
  );
}

export default function AffordabilityCalculator() {
  const [selectedType, setSelectedType] = useState<LoanType>("home");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Affordability Calculator</h1>

      {/* Loan Type Tabs */}
      <div className="mb-8">
        <TabSelector
          options={LOAN_TYPE_OPTIONS}
          selected={selectedType}
          onChange={(value) => setSelectedType(value as LoanType)}
          columns={3}
        />
      </div>

      <p className="text-muted-foreground mb-8 text-lg">
        {loanTypeInfo[selectedType].description}
      </p>

      {selectedType === "car" && <CarAffordabilityCalculator />}
      {selectedType === "home" && <HomeAffordabilityCalculator />}
      {selectedType === "phone" && <PhoneAffordabilityCalculator />}
      {selectedType === "education" && <EducationLoanCalculator />}
      {selectedType === "personal" && <PersonalLoanCalculator />}
      {selectedType === "bike" && <BikeLoanCalculator />}
    </div>
  );
}
