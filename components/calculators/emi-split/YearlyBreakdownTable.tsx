"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { YearlyBreakdownTableProps } from "./types";

/**
 * Detailed year-by-year table showing rent, own pocket payment, and cumulative totals
 * Provides granular view of how rent coverage evolves annually
 */
export function YearlyBreakdownTable({ result, formatCurrency }: YearlyBreakdownTableProps) {
  // Define table columns with custom renderers for calculated values
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
      className: "text-purple-600 font-medium",
      render: (value) => formatCurrency(value),
    },
    {
      key: "yearlyOwnPocket",
      header: "Monthly Own Payoff",
      align: "right",
      className: "text-green-600 font-medium",
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
    <Card className="rounded-none border-2 border-primary/20">
      <CardHeader className="bg-muted/50 py-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">Year-by-Year Breakdown</CardTitle>
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
