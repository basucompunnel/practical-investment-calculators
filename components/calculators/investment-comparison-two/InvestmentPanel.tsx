import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/common/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { InvestmentPanelProps, InvestmentType } from "./types";
import { DEFAULTS, STEPS } from "./constants";

/**
 * Investment input panel component for a single investment
 * Displays form fields for investment parameters with conditional field disabling
 */
export function InvestmentPanel({
  title,
  color,
  inputs,
  setInputs,
  compareBy,
  comparisonMode,
  isReference,
}: InvestmentPanelProps) {
  const typeLabels = {
    sip: "SIP (Monthly)",
    stepup: "Step-up SIP",
    lumpsum: "Lumpsum",
  };

  return (
    <Card className="rounded-none border-2 border-primary/20">
      <CardHeader className="bg-muted/50 py-4">
        <CardTitle className="text-lg font-semibold uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`${title}-type`} className="text-sm font-medium">
            Investment Type
          </Label>
          <Select
            value={inputs.type}
            onValueChange={(value: InvestmentType) => {
              const defaults = DEFAULTS[value];
              setInputs({
                type: value,
                amount: String(defaults.amount),
                stepUpRate: String(defaults.stepUpRate),
                rate: String(defaults.rate),
                years: String(defaults.years),
              });
            }}
            disabled={!isReference && comparisonMode === "single"}
          >
            <SelectTrigger id={`${title}-type`} className="rounded-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sip">{typeLabels.sip}</SelectItem>
              <SelectItem value="stepup">{typeLabels.stepup}</SelectItem>
              <SelectItem value="lumpsum">{typeLabels.lumpsum}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <FormField
          id={`${title}-amount`}
          label={
            inputs.type === "lumpsum"
              ? "Investment Amount (₹)"
              : "Monthly Investment (₹)"
          }
          arrowStep={STEPS.amount}
          value={inputs.amount}
          onChange={(value) => setInputs({ ...inputs, amount: value })}
          disabled={!isReference && comparisonMode === "single" && compareBy !== "amount"}
        />

        {inputs.type === "stepup" && (
          <FormField
            id={`${title}-stepup`}
            label="Annual Step-up Rate (%)"
            step="0.1"
            arrowStep={STEPS.rate}
            value={inputs.stepUpRate}
            onChange={(value) => setInputs({ ...inputs, stepUpRate: value })}
            disabled={!isReference && comparisonMode === "single" && compareBy !== "stepUpRate"}
          />
        )}

        <FormField
          id={`${title}-rate`}
          label="Expected Return (% p.a.)"
          step="0.1"
          arrowStep={STEPS.rate}
          value={inputs.rate}
          onChange={(value) => setInputs({ ...inputs, rate: value })}
          disabled={!isReference && comparisonMode === "single" && compareBy !== "rate"}
        />

        <FormField
          id={`${title}-years`}
          label="Investment Period (years)"
          arrowStep={STEPS.years}
          value={inputs.years}
          onChange={(value) => setInputs({ ...inputs, years: value })}
          disabled={!isReference && comparisonMode === "single" && compareBy !== "years"}
        />
      </CardContent>
    </Card>
  );
}
