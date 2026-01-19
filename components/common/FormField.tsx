import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  step?: string;
  arrowStep?: number;
  value: string;
  onChange: (value: string) => void;
}

export function FormField({ id, label, type = "number", step, arrowStep = 1, value, onChange }: FormFieldProps) {
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
        className="rounded-none h-12 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}
