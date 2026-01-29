import { FormField } from "@/components/common/FormField";

/**
 * Expected Returns Form Component
 * 
 * Allows users to customize expected annual returns for each investment type.
 * Default values are provided based on historical averages, but users can
 * adjust them based on their own expectations or market conditions.
 * 
 * @param equityReturn - Expected annual return for equity funds (%)
 * @param goldReturn - Expected annual return for gold (%)
 * @param debtReturn - Expected annual return for debt funds (%)
 * @param fdReturn - Expected annual return for fixed deposits (%)
 */
export function ExpectedReturnsForm({
  equityReturn,
  setEquityReturn,
  goldReturn,
  setGoldReturn,
  debtReturn,
  setDebtReturn,
  fdReturn,
  setFdReturn,
}: {
  equityReturn: string;
  setEquityReturn: (value: string) => void;
  goldReturn: string;
  setGoldReturn: (value: string) => void;
  debtReturn: string;
  setDebtReturn: (value: string) => void;
  fdReturn: string;
  setFdReturn: (value: string) => void;
}) {
  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Expected Annual Returns (%)</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FormField
          id="equityReturn"
          label="Equity Fund"
          step="0.1"
          arrowStep={0.5}
          value={equityReturn}
          onChange={setEquityReturn}
        />
        <FormField
          id="goldReturn"
          label="Gold"
          step="0.1"
          arrowStep={0.5}
          value={goldReturn}
          onChange={setGoldReturn}
        />
        <FormField
          id="debtReturn"
          label="Debt Fund"
          step="0.1"
          arrowStep={0.5}
          value={debtReturn}
          onChange={setDebtReturn}
        />
        <FormField
          id="fdReturn"
          label="Fixed Deposit"
          step="0.1"
          arrowStep={0.5}
          value={fdReturn}
          onChange={setFdReturn}
        />
      </div>
    </div>
  );
}
