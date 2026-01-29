/**
 * Utility functions for affordability calculator
 */

/**
 * Format number as Indian Rupee currency with no decimal places
 * Example: 1234567 → ₹12,34,567
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};
