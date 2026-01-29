import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { YearlyBreakdown } from "./types";
import { formatCurrency } from "./utils";

interface LoanAmortizationChartProps {
  data: YearlyBreakdown[];
}

/**
 * Combined chart showing year-by-year loan amortization
 * Stacked bars: Principal (purple) + Interest (green) payments per year
 * Line: Remaining balance over time (blue)
 * Colors match the investment comparison chart for consistency
 */
export function LoanAmortizationChart({ data }: LoanAmortizationChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="year" 
            label={{ value: 'Year', position: 'insideBottom', offset: -10 }}
            className="text-sm"
          />
          <YAxis 
            label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
            className="text-sm"
          />
          <Tooltip 
            formatter={(value) => value ? formatCurrency(Number(value)) : ''}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />
          <Bar 
            dataKey="principalPaid" 
            stackId="a" 
            fill="#8b5cf6" 
            name="Principal Paid"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="interestPaid" 
            stackId="a" 
            fill="#10b981" 
            name="Interest Paid"
            radius={[4, 4, 0, 0]}
          />
          <Line 
            type="monotone" 
            dataKey="closingBalance" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="Closing Balance"
            dot={{ fill: '#3b82f6', r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
