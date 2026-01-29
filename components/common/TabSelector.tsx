import { Card, CardContent } from "@/components/ui/card";

/**
 * Individual tab option data structure
 * 
 * @property value - Unique identifier for the option (used for state management)
 * @property label - Display text shown on the tab button
 */
interface TabOption {
  value: string;
  label: string;
}

/**
 * Props for TabSelector component
 * 
 * @property options - Array of tab options to display
 * @property selected - Currently selected tab value
 * @property onChange - Callback when tab selection changes
 * @property columns - Number of columns in grid layout (2-5, default: 4)
 */
interface TabSelectorProps {
  options: TabOption[];
  selected: string;
  onChange: (value: string) => void;
  columns?: number;
}

/**
 * Tab Selector Component
 * 
 * Displays a grid of selectable tabs/buttons for choosing between options.
 * Provides a clean, button-based alternative to traditional tab navigation.
 * 
 * Key Features:
 * - Responsive grid layout (2 columns on mobile, configurable on desktop)
 * - Visual highlighting of selected tab with primary color
 * - Smooth hover transitions
 * - Flexible column configuration (2-5 columns)
 * - Consistent card styling with app theme
 * 
 * Common Use Cases:
 * - Investment mode selection (Lumpsum vs SIP)
 * - Calculation mode selection (Goal vs Time vs SIP)
 * - Category selection in calculators
 * - Filter options in comparison views
 * 
 * @example
 * ```tsx
 * <TabSelector
 *   options={[
 *     { value: "lumpsum", label: "Lumpsum" },
 *     { value: "sip", label: "SIP" },
 *   ]}
 *   selected={investmentMode}
 *   onChange={setInvestmentMode}
 *   columns={2}
 * />
 * 
 * <TabSelector
 *   options={[
 *     { value: "goal", label: "Target Amount" },
 *     { value: "time", label: "Investment Period" },
 *     { value: "investment", label: "Investment Amount" },
 *   ]}
 *   selected={calculationMode}
 *   onChange={setCalculationMode}
 *   columns={3}
 * />
 * ```
 * 
 * @param options - Array of selectable options
 * @param selected - Currently selected value
 * @param onChange - Selection change handler
 * @param columns - Grid column count (default: 4)
 */
export function TabSelector({ options, selected, onChange, columns = 4 }: TabSelectorProps) {
  const gridClass = `grid gap-3 ${
    columns === 2 ? 'grid-cols-2' :
    columns === 3 ? 'grid-cols-2 md:grid-cols-3' :
    columns === 4 ? 'grid-cols-2 md:grid-cols-4' :
    columns === 5 ? 'grid-cols-2 md:grid-cols-5' :
    'grid-cols-2 md:grid-cols-4'
  }`;

  return (
    <Card className="rounded-none">
      <CardContent className="p-6">
        <div className={gridClass}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-6 py-3 rounded-none text-base font-medium transition-colors ${
                selected === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
