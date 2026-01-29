import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/common/DataTable";
import { ComparisonResults } from "./types";

interface YearlyComparisonTableProps {
  results: ComparisonResults;
  formatCurrency: (value: number) => string;
}

/**
 * Yearly Comparison Table Component
 * Displays year-by-year breakdown of all four investment types in tabular format
 * Shows portfolio value for each investment class and total invested amount per year
 * Color-coded columns for easy differentiation between investment types
 */
export function YearlyComparisonTable({
  results,
  formatCurrency,
}: YearlyComparisonTableProps) {
  return (
    <Card className="rounded-none border-2 border-primary/20">
      <CardHeader className="bg-muted/50 py-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">Year-by-Year Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <DataTable
          data={results.equity.yearlyBreakdown}
          columns={[
            { key: "year", header: "Year", align: "left" },
            {
              key: "year",
              header: "Equity Fund",
              align: "right",
              className: "text-green-600 font-medium",
              render: (value) => formatCurrency(results.equity.yearlyBreakdown[value - 1].value),
            },
            {
              key: "year",
              header: "Gold",
              align: "right",
              className: "text-yellow-600 font-medium",
              render: (value) => formatCurrency(results.gold.yearlyBreakdown[value - 1].value),
            },
            {
              key: "year",
              header: "Debt Fund",
              align: "right",
              className: "text-blue-600 font-medium",
              render: (value) => formatCurrency(results.debt.yearlyBreakdown[value - 1].value),
            },
            {
              key: "year",
              header: "Fixed Deposit",
              align: "right",
              className: "text-purple-600 font-medium",
              render: (value) => formatCurrency(results.fd.yearlyBreakdown[value - 1].value),
            },
            {
              key: "year",
              header: "Total Invested",
              align: "right",
              className: "font-medium",
              render: (value) => formatCurrency(results.equity.yearlyBreakdown[value - 1].invested),
            },
          ]}
          getRowKey={(row) => row.year}
        />
      </CardContent>
    </Card>
  );
}
