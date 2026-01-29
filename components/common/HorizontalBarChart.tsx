import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Individual bar item data structure
 * 
 * @property key - Unique identifier for React keys
 * @property name - Display label for the bar
 * @property value - Numeric value determining bar width
 * @property color - Tailwind CSS class for bar color (e.g., "bg-green-500")
 */
interface BarChartItem {
  key: string;
  name: string;
  value: number;
  color: string;
}

/**
 * Props for HorizontalBarChart component
 * 
 * @property data - Array of bar items to display
 * @property title - Chart title displayed in header
 * @property formatValue - Optional function to format numeric values (default: 2 decimals)
 * @property valueLabel - Optional suffix for values (e.g., "%", "years")
 */
interface HorizontalBarChartProps {
  data: BarChartItem[];
  title: string;
  formatValue?: (value: number) => string;
  valueLabel?: string;
}

/**
 * Bar Chart Header Subcomponent
 * 
 * Renders the chart title in a styled header matching the app theme
 */
// Subcomponent: Bar Chart Header
function BarChartHeader({ title }: { title: string }) {
  return (
    <CardHeader className="bg-muted/50 py-4">
      <CardTitle className="text-lg font-semibold uppercase tracking-wide">{title}</CardTitle>
    </CardHeader>
  );
}

/**
 * Individual Bar Item Subcomponent
 * 
 * Renders a single horizontal bar with label and value.
 * Bar width is calculated as percentage of maximum value in dataset.
 * 
 * @param item - Bar data (name, value, color)
 * @param percentage - Calculated width percentage (0-100)
 * @param formatValue - Function to format the numeric value
 * @param valueLabel - Suffix to append to formatted value
 */
// Subcomponent: Individual Bar Item
function BarItem({
  item,
  percentage,
  formatValue,
  valueLabel,
}: {
  item: BarChartItem;
  percentage: number;
  formatValue: (value: number) => string;
  valueLabel: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{item.name}</span>
        <span className="font-semibold">
          {formatValue(item.value)}
          {valueLabel}
        </span>
      </div>
      <div className="relative h-8 bg-muted rounded-none overflow-hidden">
        <div
          className={`h-full ${item.color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Horizontal Bar Chart Component
 * 
 * Displays comparative data as horizontal bars scaled to the maximum value.
 * Each bar shows both a label and formatted numeric value.
 * 
 * Key Features:
 * - Auto-scaling bars (largest value = 100% width)
 * - Custom value formatting (currency, percentages, etc.)
 * - Color-coded bars via Tailwind CSS classes
 * - Optional value label suffix
 * - Smooth animation on load/update
 * 
 * Common Use Cases:
 * - Comparing investment returns across different instruments
 * - Showing time to reach goals for different strategies
 * - Displaying allocation percentages
 * 
 * @example
 * ```tsx
 * <HorizontalBarChart
 *   data={[
 *     { key: "ppf", name: "PPF", value: 7.1, color: "bg-blue-500" },
 *     { key: "fd", name: "Fixed Deposit", value: 6.5, color: "bg-green-500" },
 *   ]}
 *   title="Expected Returns"
 *   formatValue={(value) => value.toFixed(1)}
 *   valueLabel="% p.a."
 * />
 * ```
 * 
 * @param data - Array of bar items to display
 * @param title - Chart title
 * @param formatValue - Value formatting function (default: 2 decimals)
 * @param valueLabel - Suffix for values (default: empty string)
 */
export function HorizontalBarChart({
  data,
  title,
  formatValue = (value) => value.toFixed(2),
  valueLabel = "",
}: HorizontalBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card className="rounded-none border-2 border-primary/20">
      <BarChartHeader title={title} />
      <CardContent className="p-6">
        <div className="space-y-6">
          {data.map((item) => {
            const percentage = (item.value / maxValue) * 100;
            return (
              <BarItem
                key={item.key}
                item={item}
                percentage={percentage}
                formatValue={formatValue}
                valueLabel={valueLabel}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
