import { Card, CardContent } from "@/components/ui/card";

interface SummaryDataPointProps {
  label: string;
  value: string | number;
  size?: "large" | "normal";
}

export function SummaryDataPoint({ label, value, size = "normal" }: SummaryDataPointProps) {
  return (
    <Card className="rounded-none shadow-none border-0">
      <CardContent className="p-4 space-y-2 bg-muted/50">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`font-bold ${size === "large" ? "text-3xl" : "text-2xl"}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
