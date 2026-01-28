// Investment type options: SIP (monthly), Step-up SIP (increasing monthly), or Lumpsum (one-time)
export type InvestmentType = "sip" | "stepup" | "lumpsum";

// Parameters that can be compared between two investments
export type CompareBy = "rate" | "amount" | "years" | "stepUpRate";

// Comparison modes: single (one param varies) or all (all params can differ)
export type ComparisonMode = "single" | "all";

/**
 * Input parameters for a single investment
 * All numeric values stored as strings for form input compatibility
 */
export interface InvestmentInputs {
  type: InvestmentType;        // Investment type (SIP/Step-up/Lumpsum)
  amount: string;              // Monthly investment (SIP) or lumpsum amount
  stepUpRate: string;          // Annual increase rate for step-up SIP (%)
  rate: string;                // Expected annual return rate (%)
  years: string;               // Investment duration in years
}

/**
 * Calculated results for an investment showing growth and returns
 * Includes year-by-year breakdown for detailed analysis
 */
export interface InvestmentResult {
  totalInvested: number;       // Total amount invested over the period
  maturityAmount: number;      // Final corpus value at maturity
  totalReturns: number;        // Profit earned (maturity - invested)
  absoluteReturns: number;     // Return as percentage of investment
  realMaturityAmount: number;  // Inflation-adjusted maturity amount
  realTotalReturns: number;    // Inflation-adjusted returns
  realAbsoluteReturns: number; // Real return as percentage
  yearlyBreakdown: Array<{     // Year-by-year growth details
    year: number;              // Year number (1, 2, 3...)
    invested: number;          // Amount invested in this year
    totalInvested: number;     // Cumulative investment till this year
    value: number;             // Portfolio value at year end
    realValue: number;         // Inflation-adjusted portfolio value
  }>;
}

export interface InvestmentPanelProps {
  title: string;
  color: string;
  inputs: InvestmentInputs;
  setInputs: (inputs: InvestmentInputs) => void;
  compareBy: CompareBy;
  comparisonMode: ComparisonMode;
  isReference: boolean;
}

export interface ComparisonResultsProps {
  result1: InvestmentResult;
  result2: InvestmentResult;
}
