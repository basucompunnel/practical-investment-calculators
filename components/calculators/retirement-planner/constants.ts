/**
 * Default input values for retirement planning calculator
 * Based on typical Indian retirement scenarios:
 * - 30-year work period (age 30-60)
 * - 25-year retirement period (age 60-85)
 * - ₹50,000 monthly expenses (middle-class lifestyle)
 * - 6% inflation (historical Indian average)
 * - 12% pre-retirement returns (equity-focused portfolio)
 * - 8% post-retirement returns (conservative portfolio)
 */
export const DEFAULTS = {
  currentAge: 30,
  retirementAge: 60,
  lifeExpectancy: 85,
  currentMonthlyExpenses: 50_000,
  inflationRate: 6,
  preRetirementReturn: 12,
  postRetirementReturn: 8,
  currentSavings: 0,
} as const;

/**
 * Step increments for arrow buttons in form fields
 * Provides sensible increment values for each input type
 */
export const STEPS = {
  age: 1,
  expenses: 5_000,
  rate: 0.5,
  savings: 50_000,
} as const;
