/**
 * Result interface containing all calculated EMI and rent-related metrics
 * Tracks how rental income offsets loan payments over time
 */
export interface EMIResult {
  emi: number;                          // Monthly EMI payment amount
  firstYearRent: number;                // Rent received in first year
  firstYearOwnPocket: number;           // Out-of-pocket payment in first year
  totalRentReceived: number;            // Total rent received over entire tenure
  totalOwnPocket: number;               // Total out-of-pocket payment over tenure
  totalEMIPaid: number;                 // Total EMI paid over entire tenure
  rentPercentage: number;               // Percentage of EMI covered by rent
  ownPocketPercentage: number;          // Percentage of EMI paid from own pocket
  breakEvenMonth: number | null;        // Month when rent fully covers EMI
  breakEvenYear: number | null;         // Year when rent fully covers EMI
  yearlyBreakdown: Array<{              // Year-by-year detailed breakdown
    year: number;
    monthlyRent: number;
    yearlyRent: number;
    yearlyOwnPocket: number;
  }>;
}

export interface LoanFormProps {
  propertyValue: string;
  setPropertyValue: (value: string) => void;
  downPaymentPercent: string;
  setDownPaymentPercent: (value: string) => void;
  interestRate: string;
  setInterestRate: (value: string) => void;
  tenure: string;
  setTenure: (value: string) => void;
  monthlyRent: string;
  setMonthlyRent: (value: string) => void;
  rentIncreaseRate: string;
  setRentIncreaseRate: (value: string) => void;
  onCalculate: () => void;
}

export interface ResultsSummaryProps {
  result: EMIResult;
  tenure: string;
  formatCurrency: (value: number) => string;
}

export interface EMIBreakdownChartProps {
  result: EMIResult;
  formatCurrency: (value: number) => string;
}

export interface YearlyBreakdownTableProps {
  result: EMIResult;
  formatCurrency: (value: number) => string;
}
