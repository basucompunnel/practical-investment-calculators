import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RetirementResult } from "./types";
import { formatCurrency, formatShortCurrency } from "./utils";

/**
 * Accumulation Phase Chart Component
 * 
 * Visualizes wealth building from current age to retirement age using a line chart.
 * Shows three key metrics over time:
 * - Total Invested (purple): Cumulative amount contributed via SIP
 * - Corpus Value Nominal (green): Actual portfolio value with compound growth
 * - Corpus Value Real (amber): Inflation-adjusted value in today's terms
 * 
 * Includes a detailed data table showing year-by-year breakdown of:
 * - Annual investment amount
 * - Cumulative invested amount (nominal and real)
 * - Growing corpus value (nominal and real)
 * 
 * The divergence between nominal and real values illustrates the impact of inflation
 * over the accumulation period.
 * 
 * @param result - Complete retirement calculation results with yearly breakdown
 */
export function AccumulationPhaseChart({ result }: { result: RetirementResult }) {
  return (
    <Card className="rounded-none border-2 border-primary/20">
      <CardHeader className="bg-muted/50 py-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">Wealth Accumulation Phase</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
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
              <Line
                type="monotone"
                dataKey="totalInvested"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="Total Invested (Nominal)"
                dot={{ fill: "#8b5cf6", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="corpusValue"
                stroke="#10b981"
                strokeWidth={3}
                name="Corpus Value (Nominal)"
                dot={{ fill: "#10b981", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="corpusValueReal"
                stroke="#f59e0b"
                strokeWidth={3}
                name="Corpus Value (Real)"
                dot={{ fill: "#f59e0b", r: 4 }}
              />
            </ComposedChart>
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
