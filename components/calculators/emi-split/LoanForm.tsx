"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/common/FormField";
import { LoanFormProps } from "./types";

/**
 * Input form component for property and loan details
 * Collects all necessary data to calculate EMI split between rent and own pocket
 */
export function LoanForm({
  propertyValue,
  setPropertyValue,
  downPaymentPercent,
  setDownPaymentPercent,
  interestRate,
  setInterestRate,
  tenure,
  setTenure,
  monthlyRent,
  setMonthlyRent,
  rentIncreaseRate,
  setRentIncreaseRate,
  onCalculate,
}: LoanFormProps) {
  // Calculate loan amount based on property value and down payment percentage
  const propValue = parseFloat(propertyValue) || 0;
  const downPayment = parseFloat(downPaymentPercent) || 0;
  const calculatedLoanAmount = propValue * (1 - downPayment / 100);

  return (
    <Card className="rounded-none border-2 border-primary/20">
      <CardHeader className="bg-muted/50 py-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">Property Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            id="propertyValue"
            label="Property Value (₹)"
            arrowStep={100000}
            value={propertyValue}
            onChange={setPropertyValue}
          />

          <FormField
            id="downPaymentPercent"
            label="Down Payment (%)"
            step="1"
            arrowStep={5}
            value={downPaymentPercent}
            onChange={setDownPaymentPercent}
          />

          <div className="space-y-2">
            <Label className="text-base">Loan Amount (calculated)</Label>
            <div className="h-12 flex items-center px-3 bg-muted rounded-none border text-base font-medium">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(calculatedLoanAmount)}
            </div>
          </div>

          <FormField
            id="interestRate"
            label="Interest Rate (% per annum)"
            step="0.1"
            arrowStep={0.1}
            value={interestRate}
            onChange={setInterestRate}
          />

          <FormField
            id="tenure"
            label="Loan Tenure (years)"
            arrowStep={1}
            value={tenure}
            onChange={setTenure}
          />

          <FormField
            id="monthlyRent"
            label="Monthly Rent Received (₹)"
            arrowStep={1000}
            value={monthlyRent}
            onChange={setMonthlyRent}
          />

          <FormField
            id="rentIncreaseRate"
            label="Annual Rent Increase (%)"
            step="0.5"
            arrowStep={0.5}
            value={rentIncreaseRate}
            onChange={setRentIncreaseRate}
          />
        </div>

        <Button onClick={onCalculate} className="group relative w-full overflow-hidden rounded-none h-12 text-base">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Calculate</span>
        </Button>
      </CardContent>
    </Card>
  );
}
