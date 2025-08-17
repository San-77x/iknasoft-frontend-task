"use client";
import React, { useState } from "react";

import { Badge } from "./ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
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
        <tfoot>
          <tr className="bg-gray-50/50">
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
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>

                  <nav className="flex space-x-1" aria-label="Pagination">
                    {getVisiblePages().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === "..." ? (
                          <span className="px-3 py-2 text-sm text-gray-500">
                            ...
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePageClick(page as number)}
                            className={[
                              "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                              page === currentPage
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-900",
                            ].join(" ")}
                            aria-label={`Go to page ${page}`}
                            aria-current={
                              page === currentPage ? "page" : undefined
                            }
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </nav>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors duration-200"
                    aria-label="Go to next page"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default Table;
