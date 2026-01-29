import { InvestmentType, InvestmentResult } from "./types";
import { INVESTMENT_NAMES } from "./constants";

/**
 * Format number as Indian Rupee currency with no decimal places
 * Example: 1234567 → ₹12,34,567
 */
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Calculate investment growth for a specific investment type
 * Handles three investment modes:
 * 1. SIP: Monthly fixed investments with compounding
 * 2. Step-up SIP: Monthly investments that increase annually
 * 3. Lumpsum: One-time investment with annual compounding
 * 
 * @param type - Investment class (equity, gold, debt, fd)
 * @param customReturn - Expected annual return percentage
 * @param selectedType - Investment mode (sip, stepup-sip, lumpsum)
 * @param tenure - Investment period in years
 * @param monthlyInvestment - Monthly investment amount (for SIP modes)
 * @param stepUpPercent - Annual step-up percentage (for step-up SIP)
 * @param lumpsumAmount - One-time investment amount (for lumpsum)
 * @returns Investment result with breakdown and totals
 */
export const calculateInvestment = (
  type: keyof typeof INVESTMENT_NAMES,
  customReturn: number,
  selectedType: InvestmentType,
  tenure: string,
  monthlyInvestment: string,
  stepUpPercent: string,
  lumpsumAmount: string
): InvestmentResult => {
  const years = parseFloat(tenure);
  const annualReturn = customReturn / 100;
  const yearlyBreakdown = [];
  let totalInvested = 0;
  let currentValue = 0;

  if (selectedType === "sip") {
    const monthly = parseFloat(monthlyInvestment);
    
    for (let year = 1; year <= years; year++) {
      // Add 12 months of contributions for this year
      const yearlyContribution = monthly * 12;
      totalInvested += yearlyContribution;
      
      // Apply annual growth to existing portfolio value
      currentValue = currentValue * (1 + annualReturn);
      
      // Add monthly contributions with intra-year compounding
      // Each month's contribution grows for the remaining months of the year
      for (let month = 1; month <= 12; month++) {
        const monthsRemaining = 12 - month;
        const monthlyGrowth = Math.pow(1 + annualReturn, monthsRemaining / 12);
        currentValue += monthly * monthlyGrowth;
      }

      yearlyBreakdown.push({ year, invested: totalInvested, value: currentValue });
    }
  } else if (selectedType === "stepup-sip") {
    const initialMonthly = parseFloat(monthlyInvestment);
    const stepUp = parseFloat(stepUpPercent) / 100;
    
    for (let year = 1; year <= years; year++) {
      // Increase monthly contribution by step-up percentage each year
      const currentMonthly = initialMonthly * Math.pow(1 + stepUp, year - 1);
      const yearlyContribution = currentMonthly * 12;
      totalInvested += yearlyContribution;
      
      // Apply annual growth to existing portfolio value
      currentValue = currentValue * (1 + annualReturn);
      
      // Add monthly contributions with intra-year compounding
      for (let month = 1; month <= 12; month++) {
        const monthsRemaining = 12 - month;
        const monthlyGrowth = Math.pow(1 + annualReturn, monthsRemaining / 12);
        currentValue += currentMonthly * monthlyGrowth;
      }

      yearlyBreakdown.push({ year, invested: totalInvested, value: currentValue });
    }
  } else if (selectedType === "lumpsum") {
    const amount = parseFloat(lumpsumAmount);
    totalInvested = amount;
    currentValue = amount;
    
    // Apply compound interest: A = P(1 + r)^n
    for (let year = 1; year <= years; year++) {
      currentValue = currentValue * (1 + annualReturn);
      yearlyBreakdown.push({ year, invested: totalInvested, value: currentValue });
    }
  }

  // Calculate final metrics
  const finalValue = currentValue;
  const totalReturns = finalValue - totalInvested;
  const returnPercentage = (totalReturns / totalInvested) * 100;

  return {
    name: INVESTMENT_NAMES[type],
    totalInvested,
    finalValue,
    totalReturns,
    returnPercentage,
    annualReturn: customReturn,
    yearlyBreakdown,
  };
};
