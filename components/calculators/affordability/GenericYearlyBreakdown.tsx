import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/common/DataTable";
import { YearlyBreakdown } from "./types";
import { formatCurrency } from "./utils";
import { LoanAmortizationChart } from "./LoanAmortizationChart";

interface GenericYearlyBreakdownProps {
  result: {
    yearlyBreakdown: YearlyBreakdown[];
  };
}

/**
 * Display detailed year-by-year loan amortization schedule
 * Includes both visual chart and data table with:
 * - Opening balance at start of year
 * - Principal paid during the year
 * - Interest paid during the year
 * - Closing balance at end of year
 */
export function GenericYearlyBreakdown({ result }: GenericYearlyBreakdownProps) {
  return (
    <Card className="rounded-none border-2 border-primary/20">
      <CardHeader className="bg-muted/50 py-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">Year-by-Year Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {/* Combo Chart - Visual representation of amortization */}
        <LoanAmortizationChart data={result.yearlyBreakdown} />

        {/* Data Table - Detailed numerical breakdown */}
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
