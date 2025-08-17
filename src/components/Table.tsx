"use client";
import React, { useState } from "react";
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
  itemsPerPage?: number;
  totalItems?: number;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  className = "",
  itemsPerPage = 10,
  totalItems = data.length,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the data slice for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = data.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div
      className={`overflow-x-auto w-full bg-white border border-gray-200 rounded-2xl ${className}`}
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
          {currentPageData.map((row, index) => (
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
        <tfoot>
          <tr className="bg-white">
            <td colSpan={columns.length} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
                  to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} results
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
                    aria-label="Go to previous page"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
                    aria-label="Go to next page"
                  >
                    Next
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      {currentPageData.length === 0 && data.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          No data available for this page
        </div>
      )}
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default Table;
