/**
 * Investment mode types:
 * - sip: Systematic Investment Plan with fixed monthly amount
 * - stepup: SIP with annual increment in monthly investment
 * - lumpsum: One-time investment
 */
export type InvestmentMode = "sip" | "stepup" | "lumpsum";

/**
 * Calculation mode types:
 * - investment: Calculate required investment amount for given time period
 * - time: Calculate required time period for given investment amount
 */
export type CalculationMode = "investment" | "time";

/**
 * Result data for a single investment type goal calculation
 */
export interface GoalResult {
  name: string;
  targetAmount: number;
  requiredMonthly?: number;  // Required for SIP/Step-up modes (investment calculation)
  requiredLumpsum?: number;  // Required for Lumpsum mode (investment calculation)
  requiredYears?: number;    // Required for time calculation mode
  totalInvested: number;     // Total amount invested over the period
  totalReturns: number;      // Expected returns (target - invested)
  expectedReturn: number;    // Annual return percentage
}

/**
 * Comparison results across all investment types
 */
export interface ComparisonResults {
  equity: GoalResult;
  gold: GoalResult;
  debt: GoalResult;
  fd: GoalResult;
}
