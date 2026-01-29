import { LoanBase, LoanTypeInfo, LoanType } from "./types";

/**
 * Default values for each loan type
 * Includes typical loan amounts, interest rates, and EMI-to-income ratios
 */
export const DEFAULTS: Record<LoanType, LoanBase> = {
  home: {
    principal: 5_000_000,
    loanPercentage: 80,
    interestRate: 8.5,
    tenure: 20,
    step: 100_000,
    incomeRatioAggressive: 0.45, // EMI can be 45% of income (aggressive)
    incomeRatioConservative: 0.30, // EMI should be 30% of income (conservative)
  },

  car: {
    principal: 1_000_000,
    loanPercentage: 80,
    interestRate: 8.5,
    tenure: 5,
    step: 50_000,
    incomeRatioAggressive: 0.40,
    incomeRatioConservative: 0.30,
  },

  bike: {
    principal: 150_000,
    loanPercentage: 90,
    interestRate: 10,
    tenure: 3,
    step: 10_000,
    incomeRatioAggressive: 0.15,
    incomeRatioConservative: 0.1,
  },

  education: {
    principal: 500_000,
    loanPercentage: 90,
    interestRate: 9.5,
    tenure: 10,
    step: 50_000,
    incomeRatioAggressive: 0.35,
    incomeRatioConservative: 0.25,
  },

  personal: {
    principal: 300_000,
    interestRate: 14,
    tenure: 3,
    step: 25_000,
    incomeRatioAggressive: 0.30,
    incomeRatioConservative: 0.20,
  },

  phone: {
    principal: 100_000,
    loanPercentage: 100,
    interestRate: 0, // Often 0% for promotional offers
    tenure: 1,
    step: 10_000,
    incomeRatioAggressive: 0.15,
    incomeRatioConservative: 0.10,
  },
} as const;

/**
 * Calculation constants used across all loan types
 */
export const CALCULATION_CONSTANTS = {
  monthsPerYear: 12,
  loanPercentageStep: 5,
  interestRateStep: 0.5,
  tenureStep: 1,
} as const;

/**
 * Loan type information for display
 */
export const LOAN_TYPE_INFO: Record<LoanType, LoanTypeInfo> = {
  car: {
    title: "Car Affordability",
    description: "Calculate monthly EMI and total cost for your car loan",
  },
  home: {
    title: "Home Affordability",
    description: "Calculate how much home you can afford based on your income",
  },
  phone: {
    title: "Phone Affordability",
    description: "Calculate how much phone you can afford based on your income",
  },
  education: {
    title: "Education Loan",
    description: "Calculate EMI and total cost for your education loan",
  },
  personal: {
    title: "Personal Loan",
    description: "Calculate EMI and total cost for your personal loan",
  },
  bike: {
    title: "Two-Wheeler Loan",
    description: "Calculate monthly EMI and total cost for your bike loan",
  },
};

/**
 * Loan type options for tab selector
 */
export const LOAN_TYPE_OPTIONS = [
  { value: "home", label: "Home" },
  { value: "car", label: "Car" },
  { value: "education", label: "Education" },
  { value: "personal", label: "Personal" },
  { value: "bike", label: "Bike" },
  { value: "phone", label: "Phone" },
];
