import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Props for FormField component
 * 
 * @property id - Unique identifier for input field (used for label association)
 * @property label - Display label for the input field
 * @property type - HTML input type (default: "number")
 * @property step - HTML step attribute for number inputs (e.g., "0.1" for decimals)
 * @property arrowStep - Amount to increment/decrement when arrow keys are pressed
 * @property value - Current input value as string
 * @property onChange - Callback function when value changes
 * @property disabled - Whether input is disabled
 */
interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  step?: string;
  arrowStep?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Enhanced Form Input Field Component
 * 
 * Provides a labeled number input with keyboard arrow key support for
 * incrementing/decrementing values. Prevents negative values and handles
 * floating point precision automatically.
 * 
 * Key Features:
 * - Arrow key navigation (↑/↓) with custom step increments
 * - Automatic prevention of negative values
 * - Precision handling for decimal increments (no floating point errors)
 * - Mouse wheel scroll disabled (prevents accidental value changes)
 * - Consistent styling with rounded-none theme
 * - Accessible label association
 * 
 * The arrowStep feature allows different increment amounts for different
 * field types (e.g., age: 1 year, expenses: ₹5,000, rates: 0.5%)
 * 
 * @example
 * ```tsx
 * <FormField
 *   id="currentAge"
 *   label="Current Age (years)"
 *   arrowStep={1}
 *   value={currentAge}
 *   onChange={setCurrentAge}
 * />
 * 
 * <FormField
 *   id="inflationRate"
 *   label="Inflation Rate (% p.a.)"
 *   step="0.1"
 *   arrowStep={0.5}
 *   value={inflationRate}
 *   onChange={setInflationRate}
 * />
 * ```
 * 
 * @param id - Input field identifier
 * @param label - Label text displayed above input
 * @param type - Input type (default: "number")
 * @param step - HTML step for native controls
 * @param arrowStep - Increment/decrement amount for arrow keys (default: 1)
 * @param value - Current value as string
 * @param onChange - Value change handler
 * @param disabled - Disable state
 */
export function FormField({ id, label, type = "number", step, arrowStep = 1, value, onChange, disabled = false }: FormFieldProps) {
  /**
   * Handle arrow key navigation for incrementing/decrementing values
   * 
   * - Prevents default browser behavior to avoid conflicts
   * - Increments on ArrowUp, decrements on ArrowDown
   * - Calculates decimal places from arrowStep to prevent floating point errors
   * - Ensures value never goes below 0 (using Math.max)
   * - Converts back to string for controlled input component
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const currentValue = parseFloat(value) || 0;
      const newValue = e.key === "ArrowUp" 
        ? currentValue + arrowStep 
        : currentValue - arrowStep;
      
      // Calculate decimal places from arrowStep to fix floating point precision
      const decimalPlaces = arrowStep.toString().split('.')[1]?.length || 0;
      const roundedValue = Math.max(0, parseFloat(newValue.toFixed(decimalPlaces)));
      
      onChange(roundedValue.toString());
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base">{label}</Label>
      <Input
        id={id}
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onWheel={(e) => e.currentTarget.blur()}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="rounded-none h-12 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}
