export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatShortCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${(value / 1000).toFixed(0)}K`;
};

export const DEFAULT_VALUES = {
  PROPERTY_VALUE: "5000000",
  DOWN_PAYMENT_PERCENT: "20",
  INTEREST_RATE: "8.5",
  TENURE: "20",
  MONTHLY_RENT: "16667",
  RENT_INCREASE_RATE: "8",
  ANNUAL_RENT_PERCENTAGE: 0.03,
} as const;
