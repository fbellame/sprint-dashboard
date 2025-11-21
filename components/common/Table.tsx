import { ReactNode } from 'react';

/**
 * Column Definition for Table
 */
export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
  striped?: boolean;
  hover?: boolean;
}

/**
 * Table Component
 *
 * A reusable table component with configurable columns, responsive design,
 * and accessibility features.
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<User>[] = [
 *   { header: 'Name', accessor: 'name' },
 *   { header: 'Email', accessor: 'email' },
 *   { header: 'Actions', accessor: (row) => <Button>Edit</Button> },
 * ];
 *
 * <Table data={users} columns={columns} striped hover />
 * ```
 */
export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  className = '',
  striped = true,
  hover = true,
}: TableProps<T>) {
  const getCellValue = (row: T, accessor: ColumnDef<T>['accessor']) => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    return row[accessor] as ReactNode;
  };

  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full divide-y divide-gray-200 ${className}`}
        role="table"
      >
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.align === 'right'
                    ? 'text-right'
                    : column.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                } ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={`bg-white divide-y divide-gray-200 ${
            striped ? '' : ''
          }`}
        >
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${striped && rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${
                  hover ? 'hover:bg-gray-100' : ''
                } transition-colors`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                      column.align === 'right'
                        ? 'text-right'
                        : column.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                    } ${column.className || ''}`}
                  >
                    {getCellValue(row, column.accessor)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

