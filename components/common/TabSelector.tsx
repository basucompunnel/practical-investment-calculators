import { Card, CardContent } from "@/components/ui/card";

interface TabOption {
  value: string;
  label: string;
}

interface TabSelectorProps {
  options: TabOption[];
  selected: string;
  onChange: (value: string) => void;
  columns?: number;
}

export function TabSelector({ options, selected, onChange, columns = 4 }: TabSelectorProps) {
  const gridClass = `grid gap-3 ${
    columns === 2 ? 'grid-cols-2' :
    columns === 3 ? 'grid-cols-2 md:grid-cols-3' :
    columns === 4 ? 'grid-cols-2 md:grid-cols-4' :
    columns === 5 ? 'grid-cols-2 md:grid-cols-5' :
    'grid-cols-2 md:grid-cols-4'
  }`;

  return (
    <Card className="rounded-none">
      <CardContent className="p-6">
        <div className={gridClass}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-6 py-3 rounded-none text-base font-medium transition-colors ${
                selected === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
