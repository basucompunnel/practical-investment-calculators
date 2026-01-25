import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BarChartItem {
  key: string;
  name: string;
  value: number;
  color: string;
}

interface HorizontalBarChartProps {
  data: BarChartItem[];
  title: string;
  formatValue?: (value: number) => string;
  valueLabel?: string;
}

// Subcomponent: Bar Chart Header
function BarChartHeader({ title }: { title: string }) {
  return (
    <CardHeader>
      <CardTitle className="text-2xl">{title}</CardTitle>
    </CardHeader>
  );
}

// Subcomponent: Individual Bar Item
function BarItem({
  item,
  percentage,
  formatValue,
  valueLabel,
}: {
  item: BarChartItem;
  percentage: number;
  formatValue: (value: number) => string;
  valueLabel: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{item.name}</span>
        <span className="font-semibold">
          {formatValue(item.value)}
          {valueLabel}
        </span>
      </div>
      <div className="relative h-8 bg-muted rounded-none overflow-hidden">
        <div
          className={`h-full ${item.color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function HorizontalBarChart({
  data,
  title,
  formatValue = (value) => value.toFixed(2),
  valueLabel = "",
}: HorizontalBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card className="rounded-none">
      <BarChartHeader title={title} />
      <CardContent className="p-6">
        <div className="space-y-6">
          {data.map((item) => {
            const percentage = (item.value / maxValue) * 100;
            return (
              <BarItem
                key={item.key}
                item={item}
                percentage={percentage}
                formatValue={formatValue}
                valueLabel={valueLabel}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
