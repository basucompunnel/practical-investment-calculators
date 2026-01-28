"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { SummaryDataPoint } from "@/components/common/SummaryDataPoint";
import { DataTable } from "@/components/common/DataTable";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type InvestmentType = "sip" | "stepup" | "lumpsum";
type CompareBy = "rate" | "amount" | "years" | "stepUpRate";
type ComparisonMode = "single" | "all";

interface InvestmentInputs {
  type: InvestmentType;
  amount: string;
  stepUpRate: string;
  rate: string;
  years: string;
}

interface InvestmentResult {
  totalInvested: number;
  maturityAmount: number;
  totalReturns: number;
  absoluteReturns: number;
  yearlyBreakdown: Array<{
    year: number;
    invested: number;
    totalInvested: number;
    value: number;
  }>;
}

const DEFAULTS = {
  sip: {
    amount: 10_000,
    stepUpRate: 10,
    rate: 12,
    years: 10,
  },
  stepup: {
    amount: 10_000,
    stepUpRate: 10,
    rate: 12,
    years: 10,
  },
  lumpsum: {
    amount: 100_000,
    stepUpRate: 0,
    rate: 12,
    years: 10,
  },
} as const;

const STEPS = {
  amount: 1_000,
  rate: 0.5,
  years: 1,
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

const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};

function calculateInvestment(inputs: InvestmentInputs): InvestmentResult {
  const amount = parseFloat(inputs.amount);
  const stepUpRate = parseFloat(inputs.stepUpRate) / 100;
  const rate = parseFloat(inputs.rate) / 100;
  const years = parseInt(inputs.years);

  const yearlyBreakdown: Array<{
    year: number;
    invested: number;
    totalInvested: number;
    value: number;
  }> = [];

  let totalInvested = 0;
  let currentValue = 0;
  let currentMonthlyAmount = amount;

  if (inputs.type === "lumpsum") {
    totalInvested = amount;
    for (let year = 1; year <= years; year++) {
      currentValue = amount * Math.pow(1 + rate, year);
      yearlyBreakdown.push({
        year,
        invested: year === 1 ? amount : 0,
        totalInvested,
        value: currentValue,
      });
    }
  } else {
    // SIP or Step-up SIP
    for (let year = 1; year <= years; year++) {
      let yearlyInvestment = 0;
      
      for (let month = 1; month <= 12; month++) {
        totalInvested += currentMonthlyAmount;
        yearlyInvestment += currentMonthlyAmount;
        
        // Add monthly investment and calculate growth
        currentValue += currentMonthlyAmount;
        currentValue *= 1 + rate / 12;
      }

      // Adjust value back (we calculated month-end, need year-end)
      currentValue = currentValue / Math.pow(1 + rate / 12, 12) * Math.pow(1 + rate, 1);

      yearlyBreakdown.push({
        year,
        invested: yearlyInvestment,
        totalInvested,
        value: currentValue,
      });

      // Step up the monthly amount for next year
      if (inputs.type === "stepup") {
        currentMonthlyAmount *= 1 + stepUpRate;
      }
    }
  }

  const maturityAmount = currentValue;
  const totalReturns = maturityAmount - totalInvested;
  const absoluteReturns = (totalReturns / totalInvested) * 100;

  return {
    totalInvested,
    maturityAmount,
    totalReturns,
    absoluteReturns,
    yearlyBreakdown,
  };
}

function InvestmentPanel({
  title,
  color,
  inputs,
  setInputs,
  compareBy,
  comparisonMode,
  isReference,
}: {
  title: string;
  color: string;
  inputs: InvestmentInputs;
  setInputs: (inputs: InvestmentInputs) => void;
  compareBy: CompareBy;
  comparisonMode: ComparisonMode;
  isReference: boolean;
}) {
  const typeLabels = {
    sip: "SIP (Monthly)",
    stepup: "Step-up SIP",
    lumpsum: "Lumpsum",
  };

  return (
    <Card className={`rounded-none border-2 border-${color}-600`}>
      <CardHeader className={`bg-${color}-600 text-white py-4`}>
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`${title}-type`} className="text-sm font-medium">
            Investment Type
          </Label>
          <Select
            value={inputs.type}
            onValueChange={(value: InvestmentType) => {
              const defaults = DEFAULTS[value];
              setInputs({
                type: value,
                amount: String(defaults.amount),
                stepUpRate: String(defaults.stepUpRate),
                rate: String(defaults.rate),
                years: String(defaults.years),
              });
            }}
            disabled={!isReference && comparisonMode === "single"}
          >
            <SelectTrigger id={`${title}-type`} className="rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sip">{typeLabels.sip}</SelectItem>
              <SelectItem value="stepup">{typeLabels.stepup}</SelectItem>
              <SelectItem value="lumpsum">{typeLabels.lumpsum}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <FormField
          id={`${title}-amount`}
          label={
            inputs.type === "lumpsum"
              ? "Investment Amount (₹)"
              : "Monthly Investment (₹)"
          }
          arrowStep={STEPS.amount}
          value={inputs.amount}
          onChange={(value) => setInputs({ ...inputs, amount: value })}
          disabled={!isReference && comparisonMode === "single" && compareBy !== "amount"}
        />

        {inputs.type === "stepup" && (
          <FormField
            id={`${title}-stepup`}
            label="Annual Step-up Rate (%)"
            step="0.1"
            arrowStep={STEPS.rate}
            value={inputs.stepUpRate}
            onChange={(value) => setInputs({ ...inputs, stepUpRate: value })}
            disabled={!isReference && comparisonMode === "single" && compareBy !== "stepUpRate"}
          />
        )}

        <FormField
          id={`${title}-rate`}
          label="Expected Return (% p.a.)"
          step="0.1"
          arrowStep={STEPS.rate}
          value={inputs.rate}
          onChange={(value) => setInputs({ ...inputs, rate: value })}
          disabled={!isReference && comparisonMode === "single" && compareBy !== "rate"}
        />

        <FormField
          id={`${title}-years`}
          label="Investment Period (years)"
          arrowStep={STEPS.years}
          value={inputs.years}
          onChange={(value) => setInputs({ ...inputs, years: value })}
          disabled={!isReference && comparisonMode === "single" && compareBy !== "years"}
        />
      </CardContent>
    </Card>
  );
}

function ComparisonResults({
  result1,
  result2,
}: {
  result1: InvestmentResult;
  result2: InvestmentResult;
}) {
  // Merge yearly breakdowns for comparison chart
  const maxYears = Math.max(
    result1.yearlyBreakdown.length,
    result2.yearlyBreakdown.length
  );
  const chartData = [];
  for (let i = 0; i < maxYears; i++) {
    chartData.push({
      year: i + 1,
      investment1: result1.yearlyBreakdown[i]?.value || 0,
      investment2: result2.yearlyBreakdown[i]?.value || 0,
    });
  }

  const diff = {
    invested: result1.totalInvested - result2.totalInvested,
    maturity: result1.maturityAmount - result2.maturityAmount,
    returns: result1.totalReturns - result2.totalReturns,
    investedPct: ((result1.totalInvested - result2.totalInvested) / result2.totalInvested) * 100,
    maturityPct: ((result1.maturityAmount - result2.maturityAmount) / result2.maturityAmount) * 100,
    returnsPct: ((result1.totalReturns - result2.totalReturns) / result2.totalReturns) * 100,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-none border-2 border-purple-600">
          <CardHeader className="bg-purple-600 text-white py-4">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide">
              Investment 1
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <SummaryDataPoint
              label="Total Invested"
              value={formatCurrency(result1.totalInvested)}
            />
            <SummaryDataPoint
              label="Maturity Amount"
              value={formatCurrency(result1.maturityAmount)}
              size="large"
            />
            <SummaryDataPoint
              label="Total Returns"
              value={formatCurrency(result1.totalReturns)}
            />
            <SummaryDataPoint
              label="Absolute Returns"
              value={formatPercentage(result1.absoluteReturns)}
            />
          </CardContent>
        </Card>

        <Card className="rounded-none border-2 border-green-600">
          <CardHeader className="bg-green-600 text-white py-4">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide">
              Investment 2
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <SummaryDataPoint
              label="Total Invested"
              value={formatCurrency(result2.totalInvested)}
            />
            <SummaryDataPoint
              label="Maturity Amount"
              value={formatCurrency(result2.maturityAmount)}
              size="large"
            />
            <SummaryDataPoint
              label="Total Returns"
              value={formatCurrency(result2.totalReturns)}
            />
            <SummaryDataPoint
              label="Absolute Returns"
              value={formatPercentage(result2.absoluteReturns)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Difference Card */}
      <Card className="rounded-none border-2 border-amber-600">
        <CardHeader className="bg-amber-600 text-white py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">
            Difference (Investment 1 - Investment 2)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <SummaryDataPoint
                label="Invested Difference"
                value={formatCurrency(Math.abs(diff.invested))}
              />
              <p className="text-xs text-muted-foreground">
                {formatPercentage(Math.abs(diff.investedPct))} {diff.invested >= 0 ? 'more' : 'less'}
              </p>
            </div>
            <div className="space-y-1">
              <SummaryDataPoint
                label="Maturity Difference"
                value={formatCurrency(Math.abs(diff.maturity))}
              />
              <p className="text-xs text-muted-foreground">
                {formatPercentage(Math.abs(diff.maturityPct))} {diff.maturity >= 0 ? 'more' : 'less'}
              </p>
            </div>
            <div className="space-y-1">
              <SummaryDataPoint
                label="Returns Difference"
                value={formatCurrency(Math.abs(diff.returns))}
              />
              <p className="text-xs text-muted-foreground">
                {formatPercentage(Math.abs(diff.returnsPct))} {diff.returns >= 0 ? 'more' : 'less'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Chart */}
      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">
            Growth Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="year"
                  label={{ value: "Year", position: "insideBottom", offset: -10 }}
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
                <Line
                  type="monotone"
                  dataKey="investment1"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  name="Investment 1"
                  dot={{ fill: "#8b5cf6", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="investment2"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Investment 2"
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-side Table */}
      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">
            Yearly Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable
            data={chartData}
            columns={[
              { key: "year", header: "Year", align: "left" },
              {
                key: "investment1",
                header: "Investment 1 Value",
                align: "right",
                className: "text-purple-600 font-medium",
                render: (value) => formatCurrency(value as number),
              },
              {
                key: "investment2",
                header: "Investment 2 Value",
                align: "right",
                className: "text-green-600 font-medium",
                render: (value) => formatCurrency(value as number),
              },
              {
                key: "difference",
                header: "Difference",
                align: "right",
                className: "text-amber-600 font-medium",
                render: (_, row) =>
                  formatCurrency(
                    Math.abs((row.investment1 as number) - (row.investment2 as number))
                  ),
              },
              {
                key: "ratio",
                header: "Difference %",
                align: "right",
                className: "text-muted-foreground font-medium",
                render: (_, row) => {
                  const val2 = row.investment2 as number;
                  if (val2 === 0) return "N/A";
                  const pct = (((row.investment1 as number) - val2) / val2) * 100;
                  return formatPercentage(Math.abs(pct));
                },
              },
            ]}
            getRowKey={(row) => row.year}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function InvestmentComparisonTwo() {
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("single");
  const [compareBy, setCompareBy] = useState<CompareBy>("rate");
  
  const [investment1, setInvestment1] = useState<InvestmentInputs>({
    type: "sip",
    amount: String(DEFAULTS.sip.amount),
    stepUpRate: String(DEFAULTS.sip.stepUpRate),
    rate: String(DEFAULTS.sip.rate),
    years: String(DEFAULTS.sip.years),
  });

  const [investment2, setInvestment2] = useState<InvestmentInputs>({
    type: "sip",
    amount: String(DEFAULTS.sip.amount),
    stepUpRate: String(DEFAULTS.sip.stepUpRate),
    rate: "10",
    years: String(DEFAULTS.sip.years),
  });

  const [result1, setResult1] = useState<InvestmentResult | null>(null);
  const [result2, setResult2] = useState<InvestmentResult | null>(null);

  // Sync investment2 with investment1 based on compareBy mode
  useEffect(() => {
    if (comparisonMode === "all") {
      // In "all" mode, don't sync anything - allow all parameters to differ
      return;
    }
    
    setInvestment2(prev => {
      const synced = { ...investment1 };
      // Keep only the comparison field from investment2
      if (compareBy === "rate") {
        synced.rate = prev.rate;
      } else if (compareBy === "amount") {
        synced.amount = prev.amount;
      } else if (compareBy === "years") {
        synced.years = prev.years;
      } else if (compareBy === "stepUpRate") {
        synced.stepUpRate = prev.stepUpRate;
      }
      return synced;
    });
  }, [investment1, compareBy, comparisonMode]);

  useEffect(() => {
    setResult1(null);
    setResult2(null);
  }, [investment1, investment2]);

  const handleCompare = () => {
    const r1 = calculateInvestment(investment1);
    const r2 = calculateInvestment(investment2);
    setResult1(r1);
    setResult2(r2);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Compare Two Investments</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Compare SIP, Step-up SIP, and Lumpsum investments across different time periods and rates of return
      </p>

      {/* Comparison Mode Selector */}
      <Card className="rounded-none border-2 border-primary/20 mb-6">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-lg font-semibold uppercase tracking-wide">
            Comparison Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comparison-mode" className="text-sm font-medium">
                Comparison Mode
              </Label>
              <Select
                value={comparisonMode}
                onValueChange={(value: ComparisonMode) => setComparisonMode(value)}
              >
                <SelectTrigger id="comparison-mode" className="rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Compare by Single Parameter</SelectItem>
                  <SelectItem value="all">Compare by All Parameters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {comparisonMode === "single" && (
              <div className="space-y-2">
                <Label htmlFor="compare-by" className="text-sm font-medium">
                  Compare By (only this parameter will vary)
                </Label>
                <Select
                  value={compareBy}
                  onValueChange={(value: CompareBy) => setCompareBy(value)}
                >
                  <SelectTrigger id="compare-by" className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rate">Expected Return Rate</SelectItem>
                    <SelectItem value="amount">Investment Amount</SelectItem>
                    <SelectItem value="years">Investment Period</SelectItem>
                    <SelectItem value="stepUpRate">Step-up Rate</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  All other parameters will be synchronized between both investments
                </p>
              </div>
            )}

            {comparisonMode === "all" && (
              <p className="text-xs text-muted-foreground">
                All parameters can be different between Investment 1 and Investment 2
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Input Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <InvestmentPanel
          title="Investment 1"
          color="purple"
          inputs={investment1}
          setInputs={setInvestment1}
          compareBy={compareBy}
          comparisonMode={comparisonMode}
          isReference={true}
        />
        <InvestmentPanel
          title="Investment 2"
          color="green"
          inputs={investment2}
          setInputs={setInvestment2}
          compareBy={compareBy}
          comparisonMode={comparisonMode}
          isReference={false}
        />
      </div>

      {/* Compare Button */}
      <Button
        onClick={handleCompare}
        className="group relative w-full overflow-hidden rounded-none h-12 text-base mb-6"
      >
        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative">Compare Investments</span>
      </Button>

      {/* Results */}
      {result1 && result2 && <ComparisonResults result1={result1} result2={result2} />}
    </div>
  );
}
