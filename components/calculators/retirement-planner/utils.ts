/**
 * Format number as Indian currency (₹) with no decimals
 * Uses Indian number system (lakhs/crores)
 * 
 * @param value - Numeric value to format
 * @returns Formatted currency string (e.g., "₹10,00,000")
 */
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format large currency values in short form for charts
 * Displays in Lakhs (L) or Crores (Cr) notation
 * 
 * @param value - Numeric value to format
 * @returns Short formatted string (e.g., "₹5.0L" or "₹2.5Cr")
 */
export const formatShortCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return formatCurrency(value);
};
