import { FormField } from "@/components/common/FormField";
import { CalculationMode, InvestmentMode } from "./types";

/**
 * Goal Details Form Component
 * 
 * Renders conditional form fields based on calculation mode and investment mode:
 * - Always shows: Target Amount
 * - Investment mode: Shows Time Period
 * - Time mode: Shows Monthly SIP or Lumpsum Amount
 * - Step-up mode: Shows Annual Step-up Percentage
 * 
 * @param calculationMode - Whether calculating investment or time
 * @param selectedMode - Investment strategy (SIP/Step-up/Lumpsum)
 * @param targetAmount - Goal target amount in rupees
 * @param tenure - Investment time period in years
 * @param monthlyAmount - Monthly SIP amount for time calculation
 * @param lumpsumAmount - Lumpsum amount for time calculation
 * @param stepUpPercentage - Annual increment percentage for step-up SIP
 */
export function GoalDetailsForm({
  calculationMode,
  selectedMode,
  targetAmount,
  setTargetAmount,
  tenure,
  setTenure,
  monthlyAmount,
  setMonthlyAmount,
  lumpsumAmount,
  setLumpsumAmount,
  stepUpPercentage,
  setStepUpPercentage,
}: {
  calculationMode: CalculationMode;
  selectedMode: InvestmentMode;
  targetAmount: string;
  setTargetAmount: (value: string) => void;
  tenure: string;
  setTenure: (value: string) => void;
  monthlyAmount: string;
  setMonthlyAmount: (value: string) => void;
  lumpsumAmount: string;
  setLumpsumAmount: (value: string) => void;
  stepUpPercentage: string;
  setStepUpPercentage: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        id="targetAmount"
        label="Target Amount (₹)"
        arrowStep={100000}
        value={targetAmount}
        onChange={setTargetAmount}
      />
      {calculationMode === "investment" ? (
        <FormField
          id="tenure"
          label="Time Period (years)"
          arrowStep={1}
          value={tenure}
          onChange={setTenure}
        />
      ) : (
        selectedMode === "lumpsum" ? (
          <FormField
            id="lumpsumAmount"
            label="Lumpsum Amount (₹)"
            arrowStep={10000}
            value={lumpsumAmount}
            onChange={setLumpsumAmount}
          />
        ) : (
          <FormField
            id="monthlyAmount"
            label="Monthly SIP (₹)"
            arrowStep={1000}
            value={monthlyAmount}
            onChange={setMonthlyAmount}
          />
        )
      )}
      {selectedMode === "stepup" && (
        <FormField
          id="stepUpPercentage"
          label="Annual Step-up (%)"
          step="0.1"
          arrowStep={1}
          value={stepUpPercentage}
          onChange={setStepUpPercentage}
        />
      )}
    </div>
  );
}
