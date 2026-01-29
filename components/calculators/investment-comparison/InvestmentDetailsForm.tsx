import { FormField } from "@/components/common/FormField";
import { InvestmentType } from "./types";

interface InvestmentDetailsFormProps {
  selectedType: InvestmentType;
  monthlyInvestment: string;
  setMonthlyInvestment: (value: string) => void;
  stepUpPercent: string;
  setStepUpPercent: (value: string) => void;
  lumpsumAmount: string;
  setLumpsumAmount: (value: string) => void;
  tenure: string;
  setTenure: (value: string) => void;
}

/**
 * Investment Details Form Component
 * Displays conditional form fields based on selected investment type:
 * - SIP: Monthly investment amount and tenure
 * - Step-up SIP: Initial monthly amount, annual step-up percentage, and tenure
 * - Lumpsum: One-time investment amount and tenure
 */
export function InvestmentDetailsForm({
  selectedType,
  monthlyInvestment,
  setMonthlyInvestment,
  stepUpPercent,
  setStepUpPercent,
  lumpsumAmount,
  setLumpsumAmount,
  tenure,
  setTenure,
}: InvestmentDetailsFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* SIP Fields */}
      {selectedType === "sip" && (
        <>
          <FormField
            id="monthlyInvestment"
            label="Monthly Investment (₹)"
            arrowStep={1000}
            value={monthlyInvestment}
            onChange={setMonthlyInvestment}
          />
          <FormField
            id="tenure"
            label="Investment Period (years)"
            arrowStep={1}
            value={tenure}
            onChange={setTenure}
          />
        </>
      )}

      {/* Step-up SIP Fields */}
      {selectedType === "stepup-sip" && (
        <>
          <FormField
            id="monthlyInvestment"
            label="Initial Monthly Investment (₹)"
            arrowStep={1000}
            value={monthlyInvestment}
            onChange={setMonthlyInvestment}
          />
          <FormField
            id="stepUpPercent"
            label="Annual Step-up (%)"
            step="1"
            arrowStep={5}
            value={stepUpPercent}
            onChange={setStepUpPercent}
          />
          <FormField
            id="tenure"
            label="Investment Period (years)"
            arrowStep={1}
            value={tenure}
            onChange={setTenure}
          />
        </>
      )}

      {/* Lumpsum Fields */}
      {selectedType === "lumpsum" && (
        <>
          <FormField
            id="lumpsumAmount"
            label="Investment Amount (₹)"
            arrowStep={10000}
            value={lumpsumAmount}
            onChange={setLumpsumAmount}
          />
          <FormField
            id="tenure"
            label="Investment Period (years)"
            arrowStep={1}
            value={tenure}
            onChange={setTenure}
          />
        </>
      )}
    </div>
  );
}
