import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ComparisonResultsProps } from "./types";
import { formatCurrency, formatShortCurrency, formatPercentage } from "./utils";

/**
 * Display comparison results including summary cards, charts, and tables
 * Shows both investments side-by-side with difference calculations
 */
export function ComparisonResults({ result1, result2 }: ComparisonResultsProps) {
  // Merge yearly breakdowns from both investments for side-by-side comparison
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
      realInvestment1: result1.yearlyBreakdown[i]?.realValue || 0,
      realInvestment2: result2.yearlyBreakdown[i]?.realValue || 0,
    });
  }

  // Calculate absolute and percentage differences between investments
  const diff = {
    invested: result1.totalInvested - result2.totalInvested,
    maturity: result1.maturityAmount - result2.maturityAmount,
    returns: result1.totalReturns - result2.totalReturns,
    realMaturity: result1.realMaturityAmount - result2.realMaturityAmount,
    realReturns: result1.realTotalReturns - result2.realTotalReturns,
    investedPct: ((result1.totalInvested - result2.totalInvested) / result2.totalInvested) * 100,
    maturityPct: ((result1.maturityAmount - result2.maturityAmount) / result2.maturityAmount) * 100,
    returnsPct: ((result1.totalReturns - result2.totalReturns) / result2.totalReturns) * 100,
    realMaturityPct: ((result1.realMaturityAmount - result2.realMaturityAmount) / result2.realMaturityAmount) * 100,
    realReturnsPct: ((result1.realTotalReturns - result2.realTotalReturns) / result2.realTotalReturns) * 100,
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-none border-2 border-primary/20">
          <CardHeader className="bg-muted/50 py-4">
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
              label="Maturity Amount (Nominal)"
              value={formatCurrency(result1.maturityAmount)}
              size="large"
            />
            <SummaryDataPoint
              label="Maturity Amount (Real)"
              value={formatCurrency(result1.realMaturityAmount)}
              size="large"
            />
            <SummaryDataPoint
              label="Total Returns (Nominal)"
              value={formatCurrency(result1.totalReturns)}
            />
            <SummaryDataPoint
              label="Total Returns (Real)"
              value={formatCurrency(result1.realTotalReturns)}
            />
            <SummaryDataPoint
              label="Absolute Returns (Nominal)"
              value={formatPercentage(result1.absoluteReturns)}
            />
            <SummaryDataPoint
              label="Absolute Returns (Real)"
              value={formatPercentage(result1.realAbsoluteReturns)}
            />
          </CardContent>
        </Card>

        <Card className="rounded-none border-2 border-primary/20">
          <CardHeader className="bg-muted/50 py-4">
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
              label="Maturity Amount (Nominal)"
              value={formatCurrency(result2.maturityAmount)}
              size="large"
            />
            <SummaryDataPoint
              label="Maturity Amount (Real)"
              value={formatCurrency(result2.realMaturityAmount)}
              size="large"
            />
            <SummaryDataPoint
              label="Total Returns (Nominal)"
              value={formatCurrency(result2.totalReturns)}
            />
            <SummaryDataPoint
              label="Total Returns (Real)"
              value={formatCurrency(result2.realTotalReturns)}
            />
            <SummaryDataPoint
              label="Absolute Returns (Nominal)"
              value={formatPercentage(result2.absoluteReturns)}
            />
            <SummaryDataPoint
              label="Absolute Returns (Real)"
              value={formatPercentage(result2.realAbsoluteReturns)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Difference Card */}
      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">
            Difference (Investment 1 - Investment 2)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Nominal Differences</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <SummaryDataPoint
                    label="Invested Difference"
                    value={formatCurrency(Math.abs(diff.invested))}
                  />
                  <p className="text-sm font-semibold text-amber-700">
                    {formatPercentage(Math.abs(diff.investedPct))} {diff.invested >= 0 ? 'more' : 'less'}
                  </p>
                </div>
                <div className="space-y-1">
                  <SummaryDataPoint
                    label="Maturity Difference"
                    value={formatCurrency(Math.abs(diff.maturity))}
                  />
                  <p className="text-sm font-semibold text-amber-700">
                    {formatPercentage(Math.abs(diff.maturityPct))} {diff.maturity >= 0 ? 'more' : 'less'}
                  </p>
                </div>
                <div className="space-y-1">
                  <SummaryDataPoint
                    label="Returns Difference"
                    value={formatCurrency(Math.abs(diff.returns))}
                  />
                  <p className="text-sm font-semibold text-amber-700">
                    {formatPercentage(Math.abs(diff.returnsPct))} {diff.returns >= 0 ? 'more' : 'less'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Real (Inflation-Adjusted) Differences</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <SummaryDataPoint
                    label="Invested Difference"
                    value={formatCurrency(Math.abs(diff.invested))}
                  />
                  <p className="text-sm font-semibold text-amber-700">
                    {formatPercentage(Math.abs(diff.investedPct))} {diff.invested >= 0 ? 'more' : 'less'}
                  </p>
                </div>
                <div className="space-y-1">
                  <SummaryDataPoint
                    label="Real Maturity Difference"
                    value={formatCurrency(Math.abs(diff.realMaturity))}
                  />
                  <p className="text-sm font-semibold text-amber-700">
                    {formatPercentage(Math.abs(diff.realMaturityPct))} {diff.realMaturity >= 0 ? 'more' : 'less'}
                  </p>
                </div>
                <div className="space-y-1">
                  <SummaryDataPoint
                    label="Real Returns Difference"
                    value={formatCurrency(Math.abs(diff.realReturns))}
                  />
                  <p className="text-sm font-semibold text-amber-700">
                    {formatPercentage(Math.abs(diff.realReturnsPct))} {diff.realReturns >= 0 ? 'more' : 'less'}
                  </p>
                </div>
              </div>
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
                  name="Investment 1 (Nominal)"
                  dot={{ fill: "#8b5cf6", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="investment2"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Investment 2 (Nominal)"
                  dot={{ fill: "#10b981", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="realInvestment1"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Investment 1 (Real)"
                  dot={{ fill: "#8b5cf6", r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="realInvestment2"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Investment 2 (Real)"
                  dot={{ fill: "#10b981", r: 3 }}
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
                header: "Investment 1 (Nominal)",
                align: "right",
                className: "text-purple-600 font-medium",
                render: (value) => formatCurrency(value as number),
              },
              {
                key: "investment2",
                header: "Investment 2 (Nominal)",
                align: "right",
                className: "text-green-600 font-medium",
                render: (value) => formatCurrency(value as number),
              },
              {
                key: "realInvestment1",
                header: "Investment 1 (Real)",
                align: "right",
                className: "text-purple-400 font-medium",
                render: (value) => formatCurrency(value as number),
              },
              {
                key: "realInvestment2",
                header: "Investment 2 (Real)",
                align: "right",
                className: "text-green-400 font-medium",
                render: (value) => formatCurrency(value as number),
              },
              {
                key: "difference",
                header: "Difference (Nominal)",
                align: "right",
                className: "text-amber-600 font-medium",
                render: (_, row) =>
                  formatCurrency(
                    Math.abs((row.investment1 as number) - (row.investment2 as number))
                  ),
              },
              {
                key: "realDifference",
                header: "Difference (Real)",
                align: "right",
                className: "text-amber-400 font-medium",
                render: (_, row) =>
                  formatCurrency(
                    Math.abs((row.realInvestment1 as number) - (row.realInvestment2 as number))
                  ),
              },
            ]}
            getRowKey={(row) => row.year}
          />
        </CardContent>
      </Card>
    </div>
  );
}
