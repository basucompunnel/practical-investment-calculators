import { Card, CardContent } from "@/components/ui/card";

interface SummaryDataPointProps {
  label: string;
  value: string | number;
  size?: "large" | "normal";
}

export function SummaryDataPoint({ label, value, size = "normal" }: SummaryDataPointProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`font-bold ${size === "large" ? "text-3xl" : "text-xl"}`}>{value}</p>
    </div>
  );
}
