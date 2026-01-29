/**
 * Default expected annual returns for different investment types (in percentage)
 * These are historical averages and can be customized by the user
 */
export const EXPECTED_RETURNS = {
  equity: 12,    // Equity funds typically offer higher returns with higher risk
  gold: 10,      // Gold as a hedge against inflation
  debt: 7,       // Debt funds for moderate, stable returns
  fd: 6.5,       // Fixed deposits for guaranteed, lower returns
};

/**
 * Display names for investment types
 */
export const INVESTMENT_NAMES = {
  equity: "Equity Fund",
  gold: "Gold",
  debt: "Debt Fund",
  fd: "Fixed Deposit",
};

/**
 * Investment mode selection options for TabSelector
 */
export const INVESTMENT_MODE_OPTIONS = [
  { value: "sip", label: "SIP" },
  { value: "stepup", label: "Step-up SIP" },
  { value: "lumpsum", label: "Lumpsum" },
];

/**
 * Calculation mode selection options for TabSelector
 */
export const CALCULATION_MODE_OPTIONS = [
  { value: "investment", label: "Calculate Investment" },
  { value: "time", label: "Calculate Time" },
];
