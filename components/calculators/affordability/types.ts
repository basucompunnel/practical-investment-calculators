/**
 * Type definitions for affordability calculator
 */

/** Supported loan types */
export type LoanType = "car" | "home" | "phone" | "education" | "personal" | "bike";

/** Yearly breakdown entry for amortization schedule */
export interface YearlyBreakdown {
  year: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

/** Car loan calculation result */
export interface CarLoanResult {
  carPrice: number;
  loanAmount: number;
  downPayment: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  totalCost: number;
  suggestedIncomeMin: number;
  suggestedIncomeMax: number;
  yearlyBreakdown: YearlyBreakdown[];
}

/** Home loan calculation result */
export interface HomeLoanResult {
  homePrice: number;
  loanAmount: number;
  downPayment: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  totalCost: number;
  suggestedIncomeMin: number;
  suggestedIncomeMax: number;
  yearlyBreakdown: YearlyBreakdown[];
}

/** Phone loan calculation result */
export interface PhoneLoanResult {
  phonePrice: number;
  loanAmount: number;
  downPayment: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  totalCost: number;
  suggestedIncomeMin: number;
  suggestedIncomeMax: number;
  yearlyBreakdown: YearlyBreakdown[];
}

/** Education loan calculation result */
export interface EducationLoanResult {
  educationCost: number;
  loanAmount: number;
  downPayment: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  totalCost: number;
  suggestedIncomeMin: number;
  suggestedIncomeMax: number;
  yearlyBreakdown: YearlyBreakdown[];
}

/** Personal loan calculation result */
export interface PersonalLoanResult {
  loanAmount: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  suggestedIncomeMin: number;
  suggestedIncomeMax: number;
  yearlyBreakdown: YearlyBreakdown[];
}

/** Bike loan calculation result */
export interface BikeLoanResult {
  bikePrice: number;
  loanAmount: number;
  downPayment: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayable: number;
  totalCost: number;
  suggestedIncomeMin: number;
  suggestedIncomeMax: number;
  yearlyBreakdown: YearlyBreakdown[];
}

/** Loan type information */
export interface LoanTypeInfo {
  title: string;
  description: string;
}

/** Base loan configuration */
export interface LoanBase {
  principal: number;
  loanPercentage?: number;
  interestRate: number;
  tenure: number;
  step: number;
  incomeRatioAggressive: number;
  incomeRatioConservative: number;
}
