import { TabSelector } from "@/components/common/TabSelector";
import { CalculationMode } from "./types";
import { CALCULATION_MODE_OPTIONS } from "./constants";

/**
 * Calculation Mode Selector Component
 * 
 * Allows users to choose between two calculation modes:
 * - Calculate Investment: Given time period, calculate required investment amount
 * - Calculate Time: Given investment amount, calculate required time period
 * 
 * @param selectedMode - Currently selected calculation mode
 * @param onModeChange - Callback when mode selection changes
 */
export function CalculationModeSelector({
  selectedMode,
  onModeChange,
}: {
  selectedMode: CalculationMode;
  onModeChange: (mode: CalculationMode) => void;
}) {
  return (
    <div className="mb-6">
      <TabSelector
        options={CALCULATION_MODE_OPTIONS}
        selected={selectedMode}
        onChange={(value) => onModeChange(value as CalculationMode)}
        columns={2}
      />
    </div>
  );
}
