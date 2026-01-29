import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Column configuration for DataTable
 * 
 * @template T - Type of data objects in the table
 * @property key - Property name in data object or nested path (e.g., "name" or "user.name")
 * @property header - Column header text displayed in table
 * @property align - Text alignment for column (left/right/center)
 * @property className - Additional CSS classes for column cells (e.g., for color coding)
 * @property render - Custom render function for cell content (overrides default value display)
 */
export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  align?: "left" | "right" | "center";
  className?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

/**
 * Props for DataTable component
 * 
 * @template T - Type of data objects in the table
 * @property data - Array of data objects to display in table rows
 * @property columns - Column definitions specifying how to display each field
 * @property getRowKey - Function to extract unique key from each row (for React keys)
 */
interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T) => string | number;
}

/**
 * Generic Data Table Component
 * 
 * Renders tabular data with configurable columns and custom formatting.
 * Supports nested object access, custom rendering, alignment, and styling.
 * 
 * Key Features:
 * - Type-safe column definitions with TypeScript generics
 * - Nested property access via dot notation (e.g., "user.name")
 * - Custom render functions for complex cell content
 * - Per-column alignment and CSS class customization
 * - Color-coded columns for highlighting important data
 * 
 * Common Use Cases:
 * - Financial data tables (year-by-year breakdowns)
 * - Comparison tables with formatted currency values
 * - Data grids with color-coded metrics
 * 
 * @example
 * ```tsx
 * <DataTable
 *   data={yearlyData}
 *   columns={[
 *     { key: "year", header: "Year", align: "left" },
 *     { 
 *       key: "amount", 
 *       header: "Amount", 
 *       align: "right",
 *       className: "text-green-600 font-medium",
 *       render: (value) => formatCurrency(value)
 *     }
 *   ]}
 *   getRowKey={(row) => row.year}
 * />
 * ```
 * 
 * @template T - Type of data objects in the table
 * @param data - Array of data objects to display
 * @param columns - Column configuration array
 * @param getRowKey - Function to extract unique identifier from each row
 */
export function DataTable<T>({ data, columns, getRowKey }: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead 
              key={index} 
              className={`text-base ${column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : ""}`}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={getRowKey(row)}>
            {columns.map((column, index) => {
              const value = typeof column.key === 'string' && column.key.includes('.') 
                ? column.key.split('.').reduce((obj: any, key) => obj?.[key], row)
                : (row as any)[column.key];
              
              return (
                <TableCell 
                  key={index} 
                  className={`text-base ${column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : ""} ${column.className || ""}`}
                >
                  {column.render ? column.render(value, row) : value}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
