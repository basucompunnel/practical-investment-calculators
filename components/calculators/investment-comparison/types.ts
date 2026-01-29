export type InvestmentType = "sip" | "stepup-sip" | "lumpsum" | "recurring";

export interface InvestmentResult {
  name: string;
  totalInvested: number;
  finalValue: number;
  totalReturns: number;
  returnPercentage: number;
  annualReturn: number;
  yearlyBreakdown: Array<{
    year: number;
    invested: number;
    value: number;
  }>;
}

export interface ComparisonResults {
  equity: InvestmentResult;
  gold: InvestmentResult;
  debt: InvestmentResult;
  fd: InvestmentResult;
}
