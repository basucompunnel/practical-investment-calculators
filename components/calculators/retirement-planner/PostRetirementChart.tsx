import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RetirementResult } from "./types";
import { formatCurrency, formatShortCurrency } from "./utils";

/**
 * Post-Retirement Withdrawal Phase Component
 * 
 * Visualizes corpus depletion from retirement age to life expectancy.
 * Combines bars and lines to show:
 * - Annual Withdrawal (purple bars): Amount withdrawn each year for expenses
 * - Remaining Corpus Nominal (blue line): Portfolio balance after withdrawals and growth
 * - Remaining Corpus Real (amber dashed line): Inflation-adjusted balance
 * 
 * Includes detailed table showing:
 * - Opening balance at start of year
 * - Withdrawal amount (grows with inflation)
 * - Portfolio growth on remaining balance
 * - Closing balance after withdrawal and growth
 * - All values shown in both nominal and real (inflation-adjusted) terms
 * 
 * The goal is for the corpus to last through life expectancy while providing
 * inflation-adjusted annual expenses.
 * 
 * @param result - Complete retirement calculation results with post-retirement breakdown
 */
export function PostRetirementChart({ result }: { result: RetirementResult }) {
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
                fill="#8b5cf6"
                name="Annual Withdrawal (Nominal)"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="closingBalance"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Remaining Corpus (Nominal)"
                dot={{ fill: "#3b82f6", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="closingBalanceReal"
                stroke="#f59e0b"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Remaining Corpus (Real)"
                dot={{ fill: "#f59e0b", r: 4 }}
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
