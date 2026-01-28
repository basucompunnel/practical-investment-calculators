"use client";

import { useState, useEffect } from "react";
import { EMIResult } from "./types";
import { LoanForm } from "./LoanForm";
import { ResultsSummary } from "./ResultsSummary";
import { EMIBreakdownChart } from "./EMIBreakdownChart";
import { YearlyBreakdownTable } from "./YearlyBreakdownTable";
import { DEFAULT_VALUES, formatCurrency } from "./utils";

export default function EMISplitCalculator() {
  const [propertyValue, setPropertyValue] = useState<string>(DEFAULT_VALUES.PROPERTY_VALUE);
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>(DEFAULT_VALUES.DOWN_PAYMENT_PERCENT);
  const [interestRate, setInterestRate] = useState<string>(DEFAULT_VALUES.INTEREST_RATE);
  const [tenure, setTenure] = useState<string>(DEFAULT_VALUES.TENURE);
  const [monthlyRent, setMonthlyRent] = useState<string>(DEFAULT_VALUES.MONTHLY_RENT);
  const [rentIncreaseRate, setRentIncreaseRate] = useState<string>(DEFAULT_VALUES.RENT_INCREASE_RATE);
  const [result, setResult] = useState<EMIResult | null>(null);

  /**
   * Auto-calculate monthly rent as 3% annual return on property value
   * Updates whenever property value changes to maintain realistic rent expectations
   */
  useEffect(() => {
    const propValue = parseFloat(propertyValue) || 0;
    const calculatedMonthlyRent = (propValue * DEFAULT_VALUES.ANNUAL_RENT_PERCENTAGE) / 12;
    setMonthlyRent(Math.round(calculatedMonthlyRent).toString());
  }, [propertyValue]);

  /**
   * Clear results when any input changes to prevent stale data display
   * Forces user to recalculate after modifying any parameter
   */
  useEffect(() => {
    setResult(null);
  }, [propertyValue, downPaymentPercent, interestRate, tenure, monthlyRent, rentIncreaseRate]);

  /**
   * Core calculation function that computes EMI split between rent and own pocket
   * Uses standard EMI formula and tracks year-by-year rent growth
   */
  const calculateEMI = () => {
    // Parse and prepare input values
    const propValue = parseFloat(propertyValue);
    const downPayment = parseFloat(downPaymentPercent);
    const P = propValue * (1 - downPayment / 100);  // Principal loan amount
    const r = parseFloat(interestRate) / 12 / 100;  // Monthly interest rate
    const years = parseFloat(tenure);
    const n = years * 12;                           // Total number of months
    const initialRent = parseFloat(monthlyRent);
    const rentIncrease = parseFloat(rentIncreaseRate) / 100;

    // Validate all inputs before calculation
    if (isNaN(P) || isNaN(r) || isNaN(n) || isNaN(initialRent) || isNaN(rentIncrease) || P <= 0 || r <= 0 || n <= 0 || isNaN(propValue) || propValue <= 0) {
      return;
    }

    // Calculate monthly EMI using standard formula: EMI = [P × r × (1+r)^n] / [(1+r)^n – 1]
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    // Calculate year-by-year breakdown and find break-even point
    const yearlyBreakdown = [];
    let totalRentReceived = 0;      // Running total of all rent received
    let totalOwnPocket = 0;         // Running total of own pocket payments
    let breakEvenMonth = null;      // Month when rent first covers full EMI
    let breakEvenYear = null;       // Year when rent first covers full EMI

    // Process each year to track rent growth and payment split
    for (let year = 1; year <= years; year++) {
      // Calculate rent for current year with compound growth
      const currentMonthlyRent = initialRent * Math.pow(1 + rentIncrease, year - 1);
      
      // Check if this is the break-even point (first time rent >= EMI)
      if (breakEvenMonth === null && currentMonthlyRent >= emi) {
        breakEvenYear = year;
        breakEvenMonth = 1;
      }
      
      // Rent can't cover more than EMI amount
      const rentContribution = Math.min(currentMonthlyRent, emi);
      // Remaining EMI must be paid from own pocket
      const ownPocketMonth = Math.max(0, emi - currentMonthlyRent);
      
      const yearlyRent = rentContribution * 12;
      const yearlyOwnPocket = ownPocketMonth * 12;
      
      totalRentReceived += yearlyRent;
      totalOwnPocket += yearlyOwnPocket;
      
      yearlyBreakdown.push({
        year,
        monthlyRent: currentMonthlyRent,
        yearlyRent,
        yearlyOwnPocket,
      });
    }

    const firstYearRent = Math.min(initialRent, emi);
    const firstYearOwnPocket = Math.max(0, emi - initialRent);
    
    const totalEMIPaid = emi * 12 * years;
    const rentPercentage = (totalRentReceived / totalEMIPaid) * 100;
    const ownPocketPercentage = (totalOwnPocket / totalEMIPaid) * 100;

    setResult({
      emi,
      firstYearRent,
      firstYearOwnPocket,
      totalRentReceived,
      totalOwnPocket,
      totalEMIPaid,
      rentPercentage,
      ownPocketPercentage,
      breakEvenMonth,
      breakEvenYear,
      yearlyBreakdown,
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">EMI Split Calculator</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Calculate how much of your EMI is paid by rent vs your own pocket
      </p>

      <div className="space-y-6">
        <LoanForm
          propertyValue={propertyValue}
          setPropertyValue={setPropertyValue}
          downPaymentPercent={downPaymentPercent}
          setDownPaymentPercent={setDownPaymentPercent}
          interestRate={interestRate}
          setInterestRate={setInterestRate}
          tenure={tenure}
          setTenure={setTenure}
          monthlyRent={monthlyRent}
          setMonthlyRent={setMonthlyRent}
          rentIncreaseRate={rentIncreaseRate}
          setRentIncreaseRate={setRentIncreaseRate}
          onCalculate={calculateEMI}
        />

        {result && (
          <>
            <ResultsSummary result={result} tenure={tenure} formatCurrency={formatCurrency} />
            <EMIBreakdownChart result={result} formatCurrency={formatCurrency} />
            <YearlyBreakdownTable result={result} formatCurrency={formatCurrency} />
          </>
        )}
      </div>
    </div>
  );
}
