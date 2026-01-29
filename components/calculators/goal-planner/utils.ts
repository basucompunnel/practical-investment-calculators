import { GoalResult, InvestmentMode } from "./types";
import { EXPECTED_RETURNS, INVESTMENT_NAMES } from "./constants";

/**
 * Format number as Indian currency (₹)
 * 
 * @param value - Numeric value to format
 * @returns Formatted currency string with Indian locale
 */
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Calculate time required to achieve target amount for a given investment type
 * 
 * This function performs reverse calculation - given investment amount,
 * it calculates how long it will take to reach the target amount.
 * 
 * @param type - Investment type (equity/gold/debt/fd)
 * @param customReturn - Expected annual return percentage
 * @param targetAmount - Goal target amount in rupees
 * @param selectedMode - Investment strategy (SIP/Step-up/Lumpsum)
 * @param monthlyAmount - Monthly SIP amount for time calculation
 * @param lumpsumAmount - Lumpsum amount for time calculation
 * @param stepUpPercentage - Annual increment percentage for step-up SIP
 * @returns GoalResult with time required and investment details
 */
export const calculateTimeForInvestmentType = (
  type: keyof typeof EXPECTED_RETURNS,
  customReturn: number,
  targetAmount: string,
  selectedMode: InvestmentMode,
  monthlyAmount: string,
  lumpsumAmount: string,
  stepUpPercentage: string
): GoalResult => {
  const target = parseFloat(targetAmount);
  const annualReturn = customReturn / 100;
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;

  if (selectedMode === "lumpsum") {
    const lumpsum = parseFloat(lumpsumAmount);
    // Future Value formula: FV = PV × (1 + r)^n
    // Rearranged to solve for time (n): n = ln(FV/PV) / ln(1 + r)
    // Where: PV = present value (lumpsum), FV = future value (target), r = annual return
    const years = Math.log(target / lumpsum) / Math.log(1 + annualReturn);
    const totalInvested = lumpsum;

    return {
      name: INVESTMENT_NAMES[type],
      targetAmount: target,
      requiredYears: years,
      requiredLumpsum: lumpsum,
      totalInvested,
      totalReturns: target - totalInvested,
      expectedReturn: customReturn,
    };
  } else if (selectedMode === "sip") {
    const monthly = parseFloat(monthlyAmount);
    // Future Value of Annuity (SIP) formula: FV = PMT × [(1 + r)^n - 1] / r
    // Rearranged to solve for periods (n): n = ln(1 + FV×r/PMT) / ln(1 + r)
    // Where: PMT = monthly payment, FV = future value (target), r = monthly return
    const months = Math.log(1 + (target * monthlyReturn) / monthly) / Math.log(1 + monthlyReturn);
    const years = months / 12;
    const totalInvested = monthly * months;

    return {
      name: INVESTMENT_NAMES[type],
      targetAmount: target,
      requiredYears: years,
      requiredMonthly: monthly,
      totalInvested,
      totalReturns: target - totalInvested,
      expectedReturn: customReturn,
    };
  } else {
    // Step-up SIP time calculation requires iterative approach
    // No closed-form solution exists due to dual growth rates:
    // 1. SIP amount grows at step-up rate
    // 2. Investment value grows at return rate
    const monthly = parseFloat(monthlyAmount);
    const stepUp = parseFloat(stepUpPercentage) / 100;
    const monthlyStepUp = Math.pow(1 + stepUp, 1 / 12) - 1;
    
    let months = 0;
    let currentValue = 0;
    let totalInvested = 0;
    const maxMonths = 1200; // Safety limit: 100 years maximum
    
    // Iterate month by month until target is reached
    while (currentValue < target && months < maxMonths) {
      // Calculate current month's SIP with step-up growth
      const currentSIP = monthly * Math.pow(1 + monthlyStepUp, months);
      totalInvested += currentSIP;
      // Compound previous value and add current month's SIP
      currentValue = currentValue * (1 + monthlyReturn) + currentSIP;
      months++;
    }
    
    const years = months / 12;

    return {
      name: INVESTMENT_NAMES[type],
      targetAmount: target,
      requiredYears: years,
      requiredMonthly: monthly,
      totalInvested,
      totalReturns: target - totalInvested,
      expectedReturn: customReturn,
    };
  }
};

/**
 * Calculate required investment amount to achieve target for a given investment type
 * 
 * This function performs forward calculation - given time period,
 * it calculates the required investment amount (monthly SIP, step-up SIP, or lumpsum).
 * 
 * @param type - Investment type (equity/gold/debt/fd)
 * @param customReturn - Expected annual return percentage
 * @param targetAmount - Goal target amount in rupees
 * @param tenure - Investment time period in years
 * @param selectedMode - Investment strategy (SIP/Step-up/Lumpsum)
 * @param stepUpPercentage - Annual increment percentage for step-up SIP
 * @returns GoalResult with required investment amount and details
 */
export const calculateForInvestmentType = (
  type: keyof typeof EXPECTED_RETURNS,
  customReturn: number,
  targetAmount: string,
  tenure: string,
  selectedMode: InvestmentMode,
  stepUpPercentage: string
): GoalResult => {
  const target = parseFloat(targetAmount);
  const years = parseFloat(tenure);
  const annualReturn = customReturn / 100;
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;

  if (selectedMode === "sip") {
    const months = years * 12;
    // Calculate required monthly SIP using Future Value of Annuity formula
    // PMT = (FV × r) / [(1 + r)^n - 1]
    const requiredMonthly =
      (target * monthlyReturn) / (Math.pow(1 + monthlyReturn, months) - 1);
    const totalInvested = requiredMonthly * months;

    return {
      name: INVESTMENT_NAMES[type],
      targetAmount: target,
      requiredMonthly,
      totalInvested,
      totalReturns: target - totalInvested,
      expectedReturn: customReturn,
    };
  } else if (selectedMode === "stepup") {
    const months = years * 12;
    const stepUp = parseFloat(stepUpPercentage) / 100;
    const monthlyStepUp = Math.pow(1 + stepUp, 1 / 12) - 1;

    // Step-up SIP: Calculate initial monthly SIP that grows annually
    // Future Value formula: FV = PMT × [(1 + r)^n - (1 + s)^n] / (r - s)
    // Rearranged: PMT = FV × (r - s) / [(1 + r)^n - (1 + s)^n]
    // Where: r = monthly return, s = monthly step-up rate, n = total months
    let requiredMonthly: number;
    let totalInvested = 0;

    if (Math.abs(monthlyReturn - monthlyStepUp) < 0.00001) {
      // Edge case: when return rate equals step-up rate
      // Formula simplifies to: FV = n × PMT × (1 + r)^(n-1)
      // So: PMT = FV / [n × (1 + r)^(n-1)]
      requiredMonthly = target / (months * Math.pow(1 + monthlyReturn, months - 1));
    } else {
      // Standard case: different return and step-up rates
      const powerR = Math.pow(1 + monthlyReturn, months);
      const powerS = Math.pow(1 + monthlyStepUp, months);
      requiredMonthly = (target * (monthlyReturn - monthlyStepUp)) / (powerR - powerS);
    }

    // Calculate total invested by summing all stepped-up monthly investments
    for (let i = 0; i < months; i++) {
      totalInvested += requiredMonthly * Math.pow(1 + monthlyStepUp, i);
    }

    return {
      name: INVESTMENT_NAMES[type],
      targetAmount: target,
      requiredMonthly,
      totalInvested,
      totalReturns: target - totalInvested,
      expectedReturn: customReturn,
    };
  } else {
    // Lumpsum: Calculate present value required to reach target
    // Formula: PV = FV / (1 + r)^n
    // Where: FV = future value (target), r = annual return, n = years
    const requiredLumpsum = target / Math.pow(1 + annualReturn, years);
    const totalInvested = requiredLumpsum;

    return {
      name: INVESTMENT_NAMES[type],
      targetAmount: target,
      requiredLumpsum,
      totalInvested,
      totalReturns: target - totalInvested,
      expectedReturn: customReturn,
    };
  }
};
