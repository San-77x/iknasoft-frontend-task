import React from "react";
import { Badge } from "./ui/badge";

interface TableColumn {
  key: string;
  header: string;
}

interface TableRow {
  [key: string]: string | number;
}

interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  className?: string;
}

const Table: React.FC<TableProps> = ({ columns, data, className = "" }) => {
  return (
    <div
      className={`overflow-x-auto bg-white border border-gray-200 rounded-2xl ${className}`}
    >
      <div className="flex space-x-2 items-center">
        <h2 className="text-xl pl-6 py-6 font-semibold text-gray-800">
          User Details
        </h2>
        <Badge variant="secondary">100</Badge>
      </div>
      <table className="min-w-full overflow-hidden">
        <thead>
          <tr className="bg-[#f4f4fb]">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-sm text-gray-400"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors bg-white"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="border-y border-gray-200 px-6 py-4 text-sm text-gray-700"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default Table;
