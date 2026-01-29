import { TabSelector } from "@/components/common/TabSelector";
import { InvestmentMode } from "./types";
import { INVESTMENT_MODE_OPTIONS } from "./constants";

/**
 * Investment Mode Selector Component
 * 
 * Allows users to choose the investment strategy:
 * - SIP: Fixed monthly systematic investment
 * - Step-up SIP: Monthly investment with annual increment
 * - Lumpsum: One-time investment
 * 
 * @param selectedMode - Currently selected investment mode
 * @param onModeChange - Callback when mode selection changes
 */
export function InvestmentModeSelector({
  selectedMode,
  onModeChange,
}: {
  selectedMode: InvestmentMode;
  onModeChange: (mode: InvestmentMode) => void;
}) {
  return (
    <div className="mb-8">
      <TabSelector
        options={INVESTMENT_MODE_OPTIONS}
        selected={selectedMode}
        onChange={(value) => onModeChange(value as InvestmentMode)}
        columns={3}
      />
    </div>
  );
}
