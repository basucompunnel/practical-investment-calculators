import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryDataPoint } from "@/components/common/SummaryDataPoint";
import { formatCurrency } from "./utils";

interface GenericSummaryCardsProps {
  result: {
    loanAmount: number;
    monthlyEMI: number;
    totalInterest: number;
    totalPayable: number;
    suggestedIncomeMin: number;
    suggestedIncomeMax: number;
  } & (
    | { itemPrice: number; downPayment: number; totalCost: number; itemLabel: string }
    | { itemPrice?: never; downPayment?: never; totalCost?: never; itemLabel?: never }
  );
  loanTenure: string;
  interestRate: string;
}

/**
 * Display key loan metrics in three cards:
 * 1. Item price and down payment (if applicable)
 * 2. Monthly payment and suggested income (highlighted)
 * 3. Total cost breakdown
 */
export function GenericSummaryCards({ result, loanTenure, interestRate }: GenericSummaryCardsProps) {
  const hasItemPrice = 'itemPrice' in result && result.itemPrice !== undefined;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {hasItemPrice ? (
        <Card className="rounded-none border-2 border-primary/20">
          <CardHeader className="bg-muted/50 py-4">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide">{result.itemLabel} & Down Payment</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <SummaryDataPoint
                label={result.itemLabel}
                value={formatCurrency(result.itemPrice)}
              />
              <SummaryDataPoint
                label="Loan Amount"
                value={formatCurrency(result.loanAmount)}
              />
              <SummaryDataPoint
                label="Down Payment"
                value={formatCurrency(result.downPayment!)}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-none border-2 border-primary/20">
          <CardHeader className="bg-muted/50 py-4">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide">Loan Amount</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <SummaryDataPoint
                label="Loan Amount"
                value={formatCurrency(result.loanAmount)}
                size="large"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-none border-2 border-primary">
        <CardHeader className="bg-primary text-primary-foreground py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">Monthly Payment</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <SummaryDataPoint
              label="Monthly EMI"
              value={formatCurrency(result.monthlyEMI)}
              size="large"
            />
            <SummaryDataPoint
              label="Suggested Income Range"
              value={`${formatCurrency(result.suggestedIncomeMin)} - ${formatCurrency(result.suggestedIncomeMax)}`}
            />
            <SummaryDataPoint label="Tenure" value={`${loanTenure} years`} />
            <SummaryDataPoint
              label="Interest Rate"
              value={`${interestRate}% p.a.`}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border-2 border-primary/20">
        <CardHeader className="bg-muted/50 py-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">Total Cost</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <SummaryDataPoint
              label="Total Interest"
              value={formatCurrency(result.totalInterest)}
            />
            <SummaryDataPoint
              label="Total Payable"
              value={formatCurrency(result.totalPayable)}
            />
            {hasItemPrice && (
              <SummaryDataPoint
                label={`Total Cost of ${result.itemLabel}`}
                value={formatCurrency(result.totalCost!)}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
