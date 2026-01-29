import { TabSelector } from "@/components/common/TabSelector";
import { InvestmentType } from "./types";
import { INVESTMENT_TYPE_OPTIONS } from "./constants";

interface InvestmentTypeSelectorProps {
  selectedType: InvestmentType;
  onTypeChange: (type: InvestmentType) => void;
}

/**
 * Investment Type Selector Component
 * Displays tab selector for choosing between SIP, Step-up SIP, and Lumpsum investment types
 * @param selectedType - Currently selected investment type
 * @param onTypeChange - Callback when investment type changes
 */
export function InvestmentTypeSelector({
  selectedType,
  onTypeChange,
}: InvestmentTypeSelectorProps) {
  return (
    <div className="mb-8">
      <TabSelector
        options={INVESTMENT_TYPE_OPTIONS}
        selected={selectedType}
        onChange={(value) => onTypeChange(value as InvestmentType)}
        columns={3}
      />
    </div>
  );
}
