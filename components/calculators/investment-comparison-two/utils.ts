import { InvestmentInputs, InvestmentResult } from "./types";

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
 * Format large currency values in short form (Lakhs/Crores) for chart axes
 * 1,00,000 → ₹1.0L | 1,00,00,000 → ₹1.0Cr
 */
export const formatShortCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return formatCurrency(value);
};

/**
 * Format number as percentage with 2 decimal places
 * Example: 12.5678 → 12.57%
 */
export const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};

/**
 * Calculate investment returns for SIP, Step-up SIP, or Lumpsum
 * Uses compound interest with monthly/annual compounding as applicable
 * 
 * @param inputs - Investment parameters (type, amount, rate, years, step-up rate)
 * @param inflationRate - Annual inflation rate for real returns calculation
 * @returns Complete investment analysis with yearly breakdown
 */
export function calculateInvestment(inputs: InvestmentInputs, inflationRate: number = 0): InvestmentResult {
  // Parse input values from string to numbers
  const amount = parseFloat(inputs.amount);
  const stepUpRate = parseFloat(inputs.stepUpRate) / 100;  // Convert % to decimal
  const rate = parseFloat(inputs.rate) / 100;              // Convert % to decimal
  const years = parseInt(inputs.years);

  // Initialize year-by-year tracking array
  const yearlyBreakdown: Array<{
    year: number;
    invested: number;
    totalInvested: number;
    value: number;
    realValue: number;
  }> = [];

  // Running totals for investment tracking
  let totalInvested = 0;          // Cumulative amount invested
  let currentValue = 0;           // Current portfolio value
  let currentMonthlyAmount = amount;  // Monthly SIP amount (grows for step-up)

  // Lumpsum: One-time investment with simple compound interest
  if (inputs.type === "lumpsum") {
    totalInvested = amount;
    // Calculate year-by-year growth using compound interest formula: P(1+r)^t
    for (let year = 1; year <= years; year++) {
      currentValue = amount * Math.pow(1 + rate, year);
      const realValue = currentValue / Math.pow(1 + inflationRate, year);
      yearlyBreakdown.push({
        year,
        invested: year === 1 ? amount : 0,  // Invested only in first year
        totalInvested,
        value: currentValue,
        realValue,
      });
    }
  } else {
    // SIP or Step-up SIP: Monthly investments with compound interest
    for (let year = 1; year <= years; year++) {
      let yearlyInvestment = 0;
      
      // Process 12 monthly investments for this year
      for (let month = 1; month <= 12; month++) {
        totalInvested += currentMonthlyAmount;
        yearlyInvestment += currentMonthlyAmount;
        
        // Add monthly investment and apply monthly compounding
        currentValue += currentMonthlyAmount;
        currentValue *= 1 + rate / 12;  // Monthly compound growth
      }

      // Adjust to year-end value (convert from month-end to year-end)
      currentValue = currentValue / Math.pow(1 + rate / 12, 12) * Math.pow(1 + rate, 1);

      const realValue = currentValue / Math.pow(1 + inflationRate, year);
      yearlyBreakdown.push({
        year,
        invested: yearlyInvestment,
        totalInvested,
        value: currentValue,
        realValue,
      });

      // Step up the monthly amount for next year
      if (inputs.type === "stepup") {
        currentMonthlyAmount *= 1 + stepUpRate;
      }
    }
  }

  const maturityAmount = currentValue;
  const totalReturns = maturityAmount - totalInvested;
  const absoluteReturns = (totalReturns / totalInvested) * 100;

  // Calculate inflation-adjusted (real) values
  const realMaturityAmount = maturityAmount / Math.pow(1 + inflationRate, years);
  const realTotalReturns = realMaturityAmount - totalInvested;
  const realAbsoluteReturns = (realTotalReturns / totalInvested) * 100;

  return {
    totalInvested,
    maturityAmount,
    totalReturns,
    absoluteReturns,
    realMaturityAmount,
    realTotalReturns,
    realAbsoluteReturns,
    yearlyBreakdown,
  };
}
