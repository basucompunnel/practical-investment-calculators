import { FormField } from "@/components/common/FormField";

interface ExpectedReturnsFormProps {
  equityReturn: string;
  setEquityReturn: (value: string) => void;
  goldReturn: string;
  setGoldReturn: (value: string) => void;
  debtReturn: string;
  setDebtReturn: (value: string) => void;
  fdReturn: string;
  setFdReturn: (value: string) => void;
}

/**
 * Expected Returns Form Component
 * Allows users to customize expected annual returns for each investment class:
 * - Equity Fund: Typically 10-15% annually
 * - Gold: Typically 8-12% annually
 * - Debt Fund: Typically 6-9% annually
 * - Fixed Deposit: Typically 5-7% annually
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
}: ExpectedReturnsFormProps) {
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
