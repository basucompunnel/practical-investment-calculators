/**
 * Complete retirement planning calculation results
 * Includes corpus requirements, investment needs, and year-by-year breakdowns
 * for both accumulation (pre-retirement) and withdrawal (post-retirement) phases
 */
export interface RetirementResult {
  requiredCorpus: number;
  requiredCorpusReal: number;
  currentAge: number;
  retirementAge: number;
  yearsToRetirement: number;
  monthlyInvestmentNeeded: number;
  totalInvestment: number;
  totalReturns: number;
  inflationAdjustedExpenses: number;
  currentExpensesEquivalent: number;
  yearlyBreakdown: Array<{
    year: number;
    age: number;
    invested: number;
    corpusValue: number;
    corpusValueReal: number;
    totalInvested: number;
    totalInvestedReal: number;
  }>;
  postRetirementBreakdown: Array<{
    year: number;
    age: number;
    openingBalance: number;
    openingBalanceReal: number;
    withdrawal: number;
    withdrawalReal: number;
    growthOnBalance: number;
    closingBalance: number;
    closingBalanceReal: number;
  }>;
}
