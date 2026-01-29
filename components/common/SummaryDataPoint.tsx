import { Card, CardContent } from "@/components/ui/card";

/**
 * Props for SummaryDataPoint component
 * 
 * @property label - Descriptive label text (displayed in small caps)
 * @property value - Data value to display (number or formatted string)
 * @property size - Display size: "large" for primary metrics, "normal" for secondary
 */
interface SummaryDataPointProps {
  label: string;
  value: string | number;
  size?: "large" | "normal";
}

/**
 * Summary Data Point Component
 * 
 * Displays a labeled data point with consistent styling.
 * Used within summary cards to show key metrics.
 * 
 * Key Features:
 * - Two size variants: large (3xl) for primary metrics, normal (xl) for secondary
 * - Uppercase label with tracking for visual hierarchy
 * - Muted label color with bold value for emphasis
 * - Consistent spacing and typography
 * 
 * Common Use Cases:
 * - Summary cards showing key calculation results
 * - Dashboard metrics and KPIs
 * - Comparison data points
 * 
 * @example
 * ```tsx
 * <SummaryDataPoint
 *   label="Required Corpus"
 *   value={formatCurrency(5000000)}
 *   size="large"
 * />
 * 
 * <SummaryDataPoint
 *   label="Monthly SIP"
 *   value={formatCurrency(25000)}
 * />
 * ```
 * 
 * @param label - Descriptive text for the data point
 * @param value - Value to display (pre-formatted if needed)
 * @param size - Display size (default: "normal")
 */
export function SummaryDataPoint({ label, value, size = "normal" }: SummaryDataPointProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`font-bold ${size === "large" ? "text-3xl" : "text-xl"}`}>{value}</p>
    </div>
  );
}
