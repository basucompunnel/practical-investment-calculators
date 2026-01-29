import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryDataPoint } from "@/components/common/SummaryDataPoint";
import { ComparisonResults, CalculationMode, InvestmentMode } from "./types";

/**
 * Results Summary Component
 * 
 * Displays comparison results across all investment types in card format.
 * Highlights the investment option with the lowest total investment requirement.
 * Shows different metrics based on calculation mode:
 * - Investment mode: Required monthly/lumpsum investment
 * - Time mode: Required time period in years
 * 
 * @param results - Calculation results for all investment types
 * @param calculationMode - Whether showing investment or time results
 * @param selectedMode - Investment strategy to determine display format
 * @param formatCurrency - Function to format numbers as currency
 */
export function ResultsSummary({
  results,
  calculationMode,
  selectedMode,
  formatCurrency,
}: {
  results: ComparisonResults;
  calculationMode: CalculationMode;
  selectedMode: InvestmentMode;
  formatCurrency: (value: number) => string;
}) {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">
        Target Amount: {formatCurrency(results.equity.targetAmount)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(results) as Array<keyof typeof results>).map((key) => {
          const result = results[key];
          const isLowest = Object.values(results).every(
            (r) => result.totalInvested <= r.totalInvested
          );

          return (
            <Card
              key={key}
              className={`rounded-none border-2 ${isLowest ? "border-primary" : "border-primary/20"}`}
            >
              <CardHeader className="bg-muted/50 py-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wide flex items-center justify-between">
                  <span>{result.name}</span>
                  {isLowest && (
                    <span className="text-sm font-normal bg-primary text-primary-foreground px-3 py-1 rounded-none">
                      Lowest Investment
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <SummaryDataPoint
                    label="Expected Return"
                    value={`${result.expectedReturn}% p.a.`}
                  />
                  {calculationMode === "investment" ? (
                    <SummaryDataPoint
                      label={selectedMode === "lumpsum" ? "Lumpsum" : "Monthly SIP"}
                      value={formatCurrency(
                        selectedMode === "lumpsum"
                          ? (result.requiredLumpsum || 0)
                          : (result.requiredMonthly || 0)
                      )}
                      size="large"
                    />
                  ) : (
                    <SummaryDataPoint
                      label="Time Required"
                      value={`${(result.requiredYears || 0).toFixed(1)} years`}
                      size="large"
                    />
                  )}
                  <SummaryDataPoint
                    label="Total Investment"
                    value={formatCurrency(result.totalInvested)}
                  />
                  <SummaryDataPoint
                    label="Expected Returns"
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
