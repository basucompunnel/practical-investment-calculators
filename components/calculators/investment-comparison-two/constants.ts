import { InvestmentType } from "./types";

/**
 * Default values for each investment type
 * Used when switching between investment types to provide sensible starting values
 */
export const DEFAULTS = {
  sip: {
    amount: 10_000,        // ₹10,000 monthly SIP
    stepUpRate: 10,        // 10% annual step-up
    rate: 12,              // 12% expected annual return
    years: 10,             // 10 year investment period
  },
  stepup: {
    amount: 10_000,        // ₹10,000 starting monthly investment
    stepUpRate: 10,        // 10% annual increase in SIP amount
    rate: 12,              // 12% expected annual return
    years: 10,             // 10 year investment period
  },
  lumpsum: {
    amount: 100_000,       // ₹1,00,000 one-time investment
    stepUpRate: 0,         // Not applicable for lumpsum
    rate: 12,              // 12% expected annual return
    years: 10,             // 10 year investment period
  },
} as const;

/**
 * Step increments for arrow key navigation in form fields
 * Allows quick adjustment of values using up/down arrow keys
 */
export const STEPS = {
  amount: 1_000,           // Increment by ₹1,000
  rate: 0.5,               // Increment by 0.5%
  years: 1,                // Increment by 1 year
} as const;
