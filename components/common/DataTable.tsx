import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  align?: "left" | "right" | "center";
  className?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T) => string | number;
}

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
