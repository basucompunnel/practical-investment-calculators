"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { EMIBreakdownChartProps } from "./types";
import { formatShortCurrency } from "./utils";

/**
 * Line chart visualizing monthly rent vs monthly out-of-pocket payment over time
 * Shows how rental income grows while own payment decreases
 */
export function EMIBreakdownChart({ result, formatCurrency }: EMIBreakdownChartProps) {
  // Transform yearly data to monthly values for chart display
  const chartData = result.yearlyBreakdown.map((item) => ({
    year: item.year,
    monthlyRent: item.monthlyRent,
    monthlyOwnPayoff: item.yearlyOwnPocket / 12,  // Convert yearly to monthly
  }));

  return (
    <Card className="rounded-none border-2 border-primary/20">
      <CardHeader className="bg-muted/50 py-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">
          EMI Payment Breakdown
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
                formatter={(value, name) => {
                  const displayName = 
                    name === "monthlyRent" ? "Monthly Rent" :
                    name === "monthlyOwnPayoff" ? "Monthly Own Payoff" : name;
                  return [formatCurrency(Number(value)), displayName];
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                type="monotone"
                dataKey="monthlyRent"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="Monthly Rent"
                dot={{ fill: "#8b5cf6", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="monthlyOwnPayoff"
                stroke="#10b981"
                strokeWidth={3}
                name="Monthly Own Payoff"
                dot={{ fill: "#10b981", r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Comparison of monthly rent vs monthly own pocket payment over time.
        </p>
      </CardContent>
    </Card>
  );
}
