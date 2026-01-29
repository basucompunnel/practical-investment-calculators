import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryDataPoint } from "@/components/common/SummaryDataPoint";
import { ComparisonResults } from "./types";

interface ResultsSummaryCardsProps {
  results: ComparisonResults;
  formatCurrency: (value: number) => string;
}

/**
 * Results Summary Cards Component
 * Displays comparison results for all four investment types in card format
 * Highlights the best performing investment with a border and badge
 * Shows total invested, final value, returns, and return percentage/multiple
 */
export function ResultsSummaryCards({
  results,
  formatCurrency,
}: ResultsSummaryCardsProps) {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">
        Total Invested: {formatCurrency(results.equity.totalInvested)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(results) as Array<keyof typeof results>).map((key) => {
          const result = results[key];
          // Identify the investment with the highest final value
          const isBest = Object.values(results).every(r => result.finalValue >= r.finalValue);
          const multiplier = result.finalValue / result.totalInvested;
          // Display as multiplier (e.g., 3.5x) if returns exceed 100%
          const showAsMultiplier = result.returnPercentage >= 100;
          
          return (
            <Card key={key} className={`rounded-none border-2 ${isBest ? "border-primary" : "border-primary/20"}`}>
              <CardHeader className="bg-muted/50 py-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wide flex items-center justify-between">
                  <span>{result.name}</span>
                  {isBest && (
                    <span className="text-sm font-normal bg-primary text-primary-foreground px-3 py-1 rounded-none">
                      Best Return
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <SummaryDataPoint
                    label="Expected Return"
                    value={`${result.annualReturn}% p.a.`}
                  />
                  <SummaryDataPoint
                    label="Final Value"
                    value={formatCurrency(result.finalValue)}
                    size="large"
                  />
                  <SummaryDataPoint
                    label={showAsMultiplier ? "Growth Multiple" : "Return Rate"}
                    value={showAsMultiplier ? `${multiplier.toFixed(2)}x` : `${result.returnPercentage.toFixed(2)}%`}
                  />
                  <SummaryDataPoint
                    label="Total Returns"
                    value={formatCurrency(result.totalReturns)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
