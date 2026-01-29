import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryDataPoint } from "@/components/common/SummaryDataPoint";
import { RetirementResult } from "./types";
import { formatCurrency } from "./utils";

/**
 * Summary Cards Component
 * 
 * Displays key retirement planning metrics in a 4-card grid:
 * 1. Corpus at Retirement (primary highlight) - Required corpus in nominal terms
 * 2. In Today's Value (amber highlight) - Inflation-adjusted corpus in today's money
 * 3. Monthly Investment - Required SIP and total investment/returns
 * 4. Timeline - Investment period and age milestones
 * 
 * The dual display of nominal and real values helps users understand both
 * the actual amount needed at retirement and its purchasing power equivalent today.
 * 
 * @param result - Complete retirement calculation results
 */
export function SummaryCards({ result }: { result: RetirementResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="rounded-none border-2 border-primary">
        <CardHeader className="bg-primary text-primary-foreground py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">Corpus at Retirement</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <SummaryDataPoint
              label="Required Corpus"
              value={formatCurrency(result.requiredCorpus)}
              size="large"
            />
            <p className="text-xs text-muted-foreground mt-2">Nominal amount</p>
          </div>
          <div className="pt-4 border-t border-border">
            <SummaryDataPoint
              label="Monthly Expenses"
              value={formatCurrency(result.inflationAdjustedExpenses)}
            />
            <p className="text-xs text-muted-foreground mt-2">At retirement</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border-2 border-amber-600">
        <CardHeader className="bg-amber-600 text-white py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">In Today's Value</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <SummaryDataPoint
              label="Required Corpus"
              value={formatCurrency(result.requiredCorpusReal)}
              size="large"
            />
            <p className="text-xs text-amber-600 font-semibold mt-2">Inflation-adjusted</p>
          </div>
          <div className="pt-4 border-t border-border">
            <SummaryDataPoint
              label="Monthly Expenses"
              value={formatCurrency(result.currentExpensesEquivalent)}
            />
            <p className="text-xs text-amber-600 font-semibold mt-2">In today's money</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">Monthly Investment</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <SummaryDataPoint
              label="SIP Required"
              value={formatCurrency(result.monthlyInvestmentNeeded)}
              size="large"
            />
            <p className="text-xs text-muted-foreground mt-2">Per month</p>
          </div>
          <div className="pt-4 border-t border-border space-y-4">
            <SummaryDataPoint
              label="Total Investment"
              value={formatCurrency(result.totalInvestment)}
            />
            <SummaryDataPoint
              label="Total Returns"
              value={formatCurrency(result.totalReturns)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <SummaryDataPoint 
              label="Investment Period" 
              value={`${result.yearsToRetirement} years`}
              size="large"
            />
            <p className="text-xs text-muted-foreground mt-2">Until retirement</p>
          </div>
          <div className="pt-4 border-t border-border space-y-4">
            <SummaryDataPoint label="Current Age" value={`${result.currentAge} years`} />
            <SummaryDataPoint label="Retirement Age" value={`${result.retirementAge} years`} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
