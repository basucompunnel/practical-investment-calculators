"use client";

import { useState, useEffect } from "react";
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
  Area,
  AreaChart,
} from "recharts";

interface RetirementResult {
  requiredCorpus: number;
  requiredCorpusReal: number;
  currentAge: number;
  retirementAge: number;
  yearsToRetirement: number;
  monthlyInvestmentNeeded: number;
  totalInvestment: number;
  totalReturns: number;
  inflationAdjustedExpenses: number;
  currentExpensesEquivalent: number;
  yearlyBreakdown: Array<{
    year: number;
    age: number;
    invested: number;
    corpusValue: number;
    corpusValueReal: number;
    totalInvested: number;
    totalInvestedReal: number;
  }>;
  postRetirementBreakdown: Array<{
    year: number;
    age: number;
    openingBalance: number;
    openingBalanceReal: number;
    withdrawal: number;
    withdrawalReal: number;
    growthOnBalance: number;
    closingBalance: number;
    closingBalanceReal: number;
  }>;
}

const DEFAULTS = {
  currentAge: 30,
  retirementAge: 60,
  lifeExpectancy: 85,
  currentMonthlyExpenses: 50_000,
  inflationRate: 6,
  preRetirementReturn: 12,
  postRetirementReturn: 8,
  currentSavings: 0,
} as const;

const STEPS = {
  age: 1,
  expenses: 5_000,
  rate: 0.5,
  savings: 50_000,
} as const;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatShortCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return formatCurrency(value);
};

// Summary Cards Component
function SummaryCards({ result }: { result: RetirementResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="rounded-none border-2 border-primary">
        <CardHeader className="bg-primary text-primary-foreground py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">Corpus at Retirement</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <SummaryDataPoint
              label="Required Corpus"
              value={formatCurrency(result.requiredCorpus)}
              size="large"
            />
            <p className="text-xs text-muted-foreground mt-2">Nominal amount</p>
          </div>
          <div className="pt-4 border-t border-border">
            <SummaryDataPoint
              label="Monthly Expenses"
              value={formatCurrency(result.inflationAdjustedExpenses)}
            />
            <p className="text-xs text-muted-foreground mt-2">At retirement</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border-2 border-amber-600">
        <CardHeader className="bg-amber-600 text-white py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">In Today's Value</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <SummaryDataPoint
              label="Required Corpus"
              value={formatCurrency(result.requiredCorpusReal)}
              size="large"
            />
            <p className="text-xs text-amber-600 font-semibold mt-2">Inflation-adjusted</p>
          </div>
          <div className="pt-4 border-t border-border">
            <SummaryDataPoint
              label="Monthly Expenses"
              value={formatCurrency(result.currentExpensesEquivalent)}
            />
            <p className="text-xs text-amber-600 font-semibold mt-2">In today's money</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">Monthly Investment</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <SummaryDataPoint
              label="SIP Required"
              value={formatCurrency(result.monthlyInvestmentNeeded)}
              size="large"
            />
            <p className="text-xs text-muted-foreground mt-2">Per month</p>
          </div>
          <div className="pt-4 border-t border-border space-y-4">
            <SummaryDataPoint
              label="Total Investment"
              value={formatCurrency(result.totalInvestment)}
            />
            <SummaryDataPoint
              label="Total Returns"
              value={formatCurrency(result.totalReturns)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <SummaryDataPoint 
              label="Investment Period" 
              value={`${result.yearsToRetirement} years`}
              size="large"
            />
            <p className="text-xs text-muted-foreground mt-2">Until retirement</p>
          </div>
          <div className="pt-4 border-t border-border space-y-4">
            <SummaryDataPoint label="Current Age" value={`${result.currentAge} years`} />
            <SummaryDataPoint label="Retirement Age" value={`${result.retirementAge} years`} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Accumulation Phase Component
function AccumulationPhaseChart({ result }: { result: RetirementResult }) {
  return (
    <Card className="rounded-none border-2 border-primary/20">
      <CardHeader className="bg-muted/50 py-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">Wealth Accumulation Phase</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={result.yearlyBreakdown}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="age"
                label={{ value: "Age", position: "insideBottom", offset: -10 }}
                className="text-sm"
              />
              <YAxis
                label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }}
                tickFormatter={(value) => formatShortCurrency(value)}
                className="text-sm"
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Area
                type="monotone"
                dataKey="totalInvested"
                stackId="1"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                name="Total Invested (Nominal)"
              />
              <Area
                type="monotone"
                dataKey="corpusValue"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Corpus Value (Nominal)"
              />
              <Line
                type="monotone"
                dataKey="corpusValueReal"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Corpus Value (Real)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <DataTable
          data={result.yearlyBreakdown}
          columns={[
            { key: "year", header: "Year", align: "left" },
            { key: "age", header: "Age", align: "left" },
            {
              key: "invested",
              header: "Annual Investment",
              align: "right",
              render: (value) => formatCurrency(value as number),
            },
            {
              key: "totalInvested",
              header: "Total Invested (Nominal)",
              align: "right",
              className: "text-purple-600 font-medium",
              render: (value) => formatCurrency(value as number),
            },
            {
              key: "corpusValue",
              header: "Corpus (Nominal)",
              align: "right",
              className: "text-green-600 font-medium",
              render: (value) => formatCurrency(value as number),
            },
            {
              key: "corpusValueReal",
              header: "Corpus (Real)",
              align: "right",
              className: "text-amber-600 font-medium",
              render: (value) => formatCurrency(value as number),
            },
          ]}
          getRowKey={(row) => row.year}
        />
      </CardContent>
    </Card>
  );
}

// Post-Retirement Phase Component
function PostRetirementChart({ result }: { result: RetirementResult }) {
  return (
    <Card className="rounded-none border-2 border-primary/20">
      <CardHeader className="bg-muted/50 py-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">Post-Retirement Withdrawal Phase</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={result.postRetirementBreakdown}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="age"
                label={{ value: "Age", position: "insideBottom", offset: -10 }}
                className="text-sm"
              />
              <YAxis
                label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }}
                tickFormatter={(value) => formatShortCurrency(value)}
                className="text-sm"
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar
                dataKey="withdrawal"
                fill="#ec4899"
                name="Annual Withdrawal (Nominal)"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="closingBalance"
                stroke="#2563eb"
                strokeWidth={2}
                name="Remaining Corpus (Nominal)"
                dot={{ fill: "#2563eb", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="closingBalanceReal"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Remaining Corpus (Real)"
                dot={{ fill: "#f59e0b", r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <DataTable
          data={result.postRetirementBreakdown}
          columns={[
            { key: "year", header: "Year", align: "left" },
            { key: "age", header: "Age", align: "left" },
            {
              key: "openingBalance",
              header: "Opening Balance (Nominal)",
              align: "right",
              render: (value) => formatCurrency(value as number),
            },
            {
              key: "withdrawal",
              header: "Withdrawal (Nominal)",
              align: "right",
              className: "text-pink-600 font-medium",
              render: (value) => formatCurrency(value as number),
            },
            {
              key: "withdrawalReal",
              header: "Withdrawal (Real)",
              align: "right",
              className: "text-amber-600 font-medium",
              render: (value) => formatCurrency(value as number),
            },
            {
              key: "closingBalance",
              header: "Closing Balance (Nominal)",
              align: "right",
              render: (value) => formatCurrency(value as number),
            },
            {
              key: "closingBalanceReal",
              header: "Closing Balance (Real)",
              align: "right",
              className: "text-amber-600 font-medium",
              render: (value) => formatCurrency(value as number),
            },
          ]}
          getRowKey={(row) => row.year}
        />
      </CardContent>
    </Card>
  );
}

export default function RetirementPlanner() {
  const [currentAge, setCurrentAge] = useState<string>(String(DEFAULTS.currentAge));
  const [retirementAge, setRetirementAge] = useState<string>(String(DEFAULTS.retirementAge));
  const [lifeExpectancy, setLifeExpectancy] = useState<string>(String(DEFAULTS.lifeExpectancy));
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState<string>(
    String(DEFAULTS.currentMonthlyExpenses)
  );
  const [inflationRate, setInflationRate] = useState<string>(String(DEFAULTS.inflationRate));
  const [preRetirementReturn, setPreRetirementReturn] = useState<string>(
    String(DEFAULTS.preRetirementReturn)
  );
  const [postRetirementReturn, setPostRetirementReturn] = useState<string>(
    String(DEFAULTS.postRetirementReturn)
  );
  const [currentSavings, setCurrentSavings] = useState<string>(String(DEFAULTS.currentSavings));

  const [result, setResult] = useState<RetirementResult | null>(null);

  useEffect(() => {
    setResult(null);
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentMonthlyExpenses,
    inflationRate,
    preRetirementReturn,
    postRetirementReturn,
    currentSavings,
  ]);

  const calculateRetirement = () => {
    const age = parseFloat(currentAge);
    const retAge = parseFloat(retirementAge);
    const lifeExp = parseFloat(lifeExpectancy);
    const monthlyExp = parseFloat(currentMonthlyExpenses);
    const inflation = parseFloat(inflationRate) / 100;
    const preRetRate = parseFloat(preRetirementReturn) / 100;
    const postRetRate = parseFloat(postRetirementReturn) / 100;
    const savings = parseFloat(currentSavings);

    const yearsToRetirement = retAge - age;
    const yearsInRetirement = lifeExp - retAge;

    // Calculate inflation-adjusted monthly expenses at retirement
    const inflationAdjustedExpenses = monthlyExp * Math.pow(1 + inflation, yearsToRetirement);
    const annualExpensesAtRetirement = inflationAdjustedExpenses * 12;

    // Calculate required corpus using inflation-adjusted annuity
    // Using annuity due formula (withdrawals at beginning of year): PV = PMT * [(1 - (1 + r)^-n) / r] * (1 + r)
    const realReturnRate = (1 + postRetRate) / (1 + inflation) - 1;
    const requiredCorpus =
      annualExpensesAtRetirement * ((1 - Math.pow(1 + realReturnRate, -yearsInRetirement)) / realReturnRate) * (1 + realReturnRate);

    // Calculate future value of current savings at retirement
    const futureValueOfSavings = savings * Math.pow(1 + preRetRate, yearsToRetirement);

    // Adjust required corpus for existing savings
    const corpusNeeded = Math.max(0, requiredCorpus - futureValueOfSavings);

    // Calculate monthly SIP needed
    const monthlyRate = preRetRate / 12;
    const months = yearsToRetirement * 12;
    const monthlyInvestmentNeeded =
      corpusNeeded / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

    const totalInvestment = monthlyInvestmentNeeded * months + savings;
    const totalReturns = requiredCorpus - totalInvestment;

    // Calculate real value of required corpus (in today's money)
    const inflationFactorAtRetirement = Math.pow(1 + inflation, yearsToRetirement);
    const requiredCorpusReal = requiredCorpus / inflationFactorAtRetirement;
    const currentExpensesEquivalent = monthlyExp;

    // Build yearly accumulation breakdown
    const yearlyBreakdown = [];
    let corpusValue = savings;
    let totalInvested = savings;

    for (let year = 1; year <= yearsToRetirement; year++) {
      const yearlyInvestment = monthlyInvestmentNeeded * 12;
      totalInvested += yearlyInvestment;

      // Add investments throughout the year and calculate growth
      corpusValue = (corpusValue + yearlyInvestment) * (1 + preRetRate);

      // Calculate real (inflation-adjusted) values
      const inflationFactor = Math.pow(1 + inflation, year);
      const corpusValueReal = corpusValue / inflationFactor;
      const totalInvestedReal = totalInvested / inflationFactor;

      yearlyBreakdown.push({
        year,
        age: age + year,
        invested: yearlyInvestment,
        corpusValue,
        corpusValueReal,
        totalInvested,
        totalInvestedReal,
      });
    }

    // Build post-retirement withdrawal breakdown
    const postRetirementBreakdown = [];
    let remainingCorpus = requiredCorpus;
    let currentAnnualExpense = annualExpensesAtRetirement;

    for (let year = 1; year <= yearsInRetirement; year++) {
      const openingBalance = remainingCorpus;
      
      // Only withdraw if corpus is available
      const withdrawal = openingBalance > 0 ? Math.min(currentAnnualExpense, openingBalance) : 0;
      const balanceAfterWithdrawal = Math.max(0, openingBalance - withdrawal);
      const growthOnBalance = balanceAfterWithdrawal * postRetRate;
      const closingBalance = balanceAfterWithdrawal + growthOnBalance;

      // Calculate real (inflation-adjusted) values
      const inflationFactor = Math.pow(1 + inflation, yearsToRetirement + year);
      const openingBalanceReal = openingBalance / inflationFactor;
      const withdrawalReal = withdrawal / inflationFactor;
      const closingBalanceReal = closingBalance / inflationFactor;

      postRetirementBreakdown.push({
        year,
        age: retAge + year,
        openingBalance: Math.max(0, openingBalance),
        openingBalanceReal: Math.max(0, openingBalanceReal),
        withdrawal,
        withdrawalReal,
        growthOnBalance,
        closingBalance,
        closingBalanceReal,
      });

      remainingCorpus = closingBalance;
      currentAnnualExpense = currentAnnualExpense * (1 + inflation);
    }

    setResult({
      requiredCorpus,
      requiredCorpusReal,
      currentAge: age,
      retirementAge: retAge,
      yearsToRetirement,
      monthlyInvestmentNeeded,
      totalInvestment,
      totalReturns,
      inflationAdjustedExpenses,
      currentExpensesEquivalent,
      yearlyBreakdown,
      postRetirementBreakdown,
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Retirement Planner</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Plan your retirement corpus and calculate monthly savings needed to achieve your goals
      </p>

      {/* Input Form */}
      <Card className="rounded-none mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Your Retirement Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              id="currentAge"
              label="Current Age (years)"
              arrowStep={STEPS.age}
              value={currentAge}
              onChange={setCurrentAge}
            />
            <FormField
              id="retirementAge"
              label="Retirement Age (years)"
              arrowStep={STEPS.age}
              value={retirementAge}
              onChange={setRetirementAge}
            />
            <FormField
              id="lifeExpectancy"
              label="Life Expectancy (years)"
              arrowStep={STEPS.age}
              value={lifeExpectancy}
              onChange={setLifeExpectancy}
            />
            <FormField
              id="currentMonthlyExpenses"
              label="Current Monthly Expenses (₹)"
              arrowStep={STEPS.expenses}
              value={currentMonthlyExpenses}
              onChange={setCurrentMonthlyExpenses}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              id="inflationRate"
              label="Inflation Rate (% p.a.)"
              step="0.1"
              arrowStep={STEPS.rate}
              value={inflationRate}
              onChange={setInflationRate}
            />
            <FormField
              id="preRetirementReturn"
              label="Pre-Retirement Return (% p.a.)"
              step="0.1"
              arrowStep={STEPS.rate}
              value={preRetirementReturn}
              onChange={setPreRetirementReturn}
            />
            <FormField
              id="postRetirementReturn"
              label="Post-Retirement Return (% p.a.)"
              step="0.1"
              arrowStep={STEPS.rate}
              value={postRetirementReturn}
              onChange={setPostRetirementReturn}
            />
            <FormField
              id="currentSavings"
              label="Current Savings (₹)"
              arrowStep={STEPS.savings}
              value={currentSavings}
              onChange={setCurrentSavings}
            />
          </div>

          <Button
            onClick={calculateRetirement}
            className="group relative w-full overflow-hidden rounded-none h-12 text-base"
          >
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Calculate Retirement Plan</span>
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <SummaryCards result={result} />
          <AccumulationPhaseChart result={result} />
          <PostRetirementChart result={result} />
        </div>
      )}
    </div>
  );
}
