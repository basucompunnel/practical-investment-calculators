"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryDataPoint } from "@/components/common/SummaryDataPoint";
import { ResultsSummaryProps } from "./types";

/**
 * Displays summary metrics showing key EMI and rent statistics
 * Includes total payments, rent coverage, and break-even point
 */
export function ResultsSummary({ result, tenure, formatCurrency }: ResultsSummaryProps) {
  return (
    <Card className="rounded-none border-2 border-primary/20">
      <CardHeader className="bg-muted/50 py-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryDataPoint
            label="Monthly EMI"
            value={formatCurrency(result.emi)}
            size="large"
          />

          <SummaryDataPoint
            label={`Total Loan Payment (Over ${tenure} years)`}
            value={formatCurrency(result.totalEMIPaid)}
          />

          {result.breakEvenYear !== null && (
            <SummaryDataPoint
              label="EMI Fully Covered by Rent From"
              value={`Year ${result.breakEvenYear}, Month ${result.breakEvenMonth}`}
            />
          )}

          <SummaryDataPoint
            label={`Total Rent Received (Over ${tenure} years)`}
            value={formatCurrency(result.totalRentReceived)}
          />

          <SummaryDataPoint
            label="Rent as % of Total EMI"
            value={`${result.rentPercentage.toFixed(1)}%`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
