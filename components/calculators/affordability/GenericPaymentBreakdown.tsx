import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "./utils";

interface GenericPaymentBreakdownProps {
  result: {
    loanAmount: number;
    totalInterest: number;
    totalPayable: number;
  } & (
    | { itemPrice: number; downPayment: number }
    | { itemPrice?: never; downPayment?: never }
  );
}

/**
 * Display visual payment breakdown with horizontal bar charts
 * Shows down payment vs loan amount (if applicable) and principal vs interest split
 */
export function GenericPaymentBreakdown({ result }: GenericPaymentBreakdownProps) {
  const hasItemPrice = 'itemPrice' in result && result.itemPrice !== undefined;
  
  return (
    <Card className="rounded-none border-2 border-primary/20">
      <CardHeader className="bg-muted/50 py-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">Payment Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className={`grid grid-cols-1 ${hasItemPrice ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-8`}>
          {/* Down Payment vs Loan Amount breakdown (only for asset purchases) */}
          {hasItemPrice && (
            <div>
              <div className="text-sm font-semibold mb-4">
                Down Payment vs Loan Amount
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                    <span className="text-sm">Down Payment</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(result.downPayment!)} (
                    {((result.downPayment! / result.itemPrice!) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                    <span className="text-sm">Loan Amount</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(result.loanAmount)} (
                    {((result.loanAmount / result.itemPrice!) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="mt-4 h-4 flex rounded-none overflow-hidden">
                <div
                  className="bg-green-600"
                  style={{
                    width: `${(result.downPayment! / result.itemPrice!) * 100}%`,
                  }}
                ></div>
                <div
                  className="bg-blue-600"
                  style={{
                    width: `${(result.loanAmount / result.itemPrice!) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Principal vs Interest breakdown - shows how much goes to loan vs interest */}
          <div>
            <div className="text-sm font-semibold mb-4">
              Principal vs Interest
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded-sm"></div>
                  <span className="text-sm">Principal</span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(result.loanAmount)} (
                  {((result.loanAmount / result.totalPayable) * 100).toFixed(1)}
                  %)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-600 rounded-sm"></div>
                  <span className="text-sm">Interest</span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(result.totalInterest)} (
                  {((result.totalInterest / result.totalPayable) * 100).toFixed(
                    1,
                  )}
                  %)
                </span>
              </div>
            </div>
            <div className="mt-4 h-4 flex rounded-none overflow-hidden">
              <div
                className="bg-purple-600"
                style={{
                  width: `${(result.loanAmount / result.totalPayable) * 100}%`,
                }}
              ></div>
              <div
                className="bg-orange-600"
                style={{
                  width: `${(result.totalInterest / result.totalPayable) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
