"use client";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Badge } from "@/components/ui/badge";
import { useMemo, useCallback, useState } from "react";
import "./react-table.css";

interface UserNode {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
  address: string;
}

import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  Cell,
} from "@table-library/react-table-library/table";

import {
  useSort,
  HeaderCellSort,
  SortToggleType,
  SortIconPositions,
} from "@table-library/react-table-library/sort";

import { nodes } from "@/app/sample-data";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

interface ColumnConfig {
  key: string;
  label: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  sortable?: boolean;
  resizable?: boolean;
}

interface TableProps {
  maxHeight?: string;
  showBorders?: boolean;
  stripedRows?: boolean;
  compactMode?: boolean;
  customColumns?: ColumnConfig[];
  showSearch?: boolean;
  showExport?: boolean;
}

const ReactTable = ({
  maxHeight = "600px",
  showBorders = true,
  stripedRows = false,
  compactMode = false,
  customColumns,
  showSearch = true,
  showExport = false,
}: TableProps) => {
  const data = useMemo(() => ({ nodes }), []);
  const [tableHeight, setTableHeight] = useState(maxHeight);
  const [searchTerm, setSearchTerm] = useState("");

  // Default column configuration
  const defaultColumns: ColumnConfig[] = [
    {
      key: "ID",
      label: "ID",
      width: "100px",
      minWidth: "80px",
      sortable: true,
      resizable: true,
    },
    {
      key: "NAME",
      label: "Name",
      width: "200px",
      minWidth: "150px",
      sortable: true,
      resizable: true,
    },
    {
      key: "EMAIL",
      label: "Email",
      width: "250px",
      minWidth: "200px",
      sortable: true,
      resizable: true,
    },
    {
      key: "AGE",
      label: "Age",
      width: "100px",
      minWidth: "80px",
      sortable: true,
      resizable: true,
    },
    {
      key: "CITY",
      label: "City",
      width: "180px",
      minWidth: "120px",
      sortable: true,
      resizable: true,
    },
    {
      key: "ADDRESS",
      label: "Address",
      width: "300px",
      minWidth: "200px",
      sortable: true,
      resizable: true,
    },
  ];

  const columns = customColumns || defaultColumns;

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return { nodes };

    const filtered = nodes.filter((node) =>
      Object.values(node).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );

    return { nodes: filtered };
  }, [searchTerm]);

  const onSortChange = useCallback((action: unknown, state: unknown) => {
    console.log("Sort changed:", action, state);
  }, []);

  const sortFunctions = useMemo(
    () => ({
      ID: (array: unknown) => (array as UserNode[]).sort((a, b) => a.id - b.id),
      NAME: (array: unknown) =>
        (array as UserNode[]).sort((a, b) => a.name.localeCompare(b.name)),
      EMAIL: (array: unknown) =>
        (array as UserNode[]).sort((a, b) => a.email.localeCompare(b.email)),
      AGE: (array: unknown) =>
        (array as UserNode[]).sort((a, b) => a.age - b.age),
      CITY: (array: unknown) =>
        (array as UserNode[]).sort((a, b) => a.city.localeCompare(b.city)),
      ADDRESS: (array: unknown) =>
        (array as UserNode[]).sort((a, b) =>
          a.address.localeCompare(b.address),
        ),
    }),
    [],
  );

  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortToggleType: SortToggleType.AlternateWithReset,
      sortFns: sortFunctions,
      sortIcon: {
        size: "16",
        margin: "4px",
        position: SortIconPositions.Prefix,
        iconDefault: <ChevronsUpDown className="w-4 h-4" />,
        iconUp: <ChevronUp className="w-4 h-4" />,
        iconDown: <ChevronDown className="w-4 h-4" />,
      },
    },
  );

  const cellPadding = compactMode ? "8px 12px" : "16px 20px";
  const headerPadding = compactMode ? "12px 12px" : "16px 20px";

  const theme = useTheme([
    getTheme(),
    {
      Table: `
        width: 100%;
        min-width: 800px;
        border-collapse: separate;
        border-spacing: 0;
        table-layout: fixed;

        .th, .td {
          border-right: ${showBorders ? "1px solid #e2e8f0" : "none"};
          position: relative;
        }

        .th:last-child, .td:last-child {
          border-right: none;
        }
      `,
      HeaderRow: `
        background-color: #f8fafc;
        border-bottom: 2px solid #e2e8f0;
        position: sticky;
        top: 0;
        z-index: 10;
      `,
      HeaderCell: `
        color: #475569;
        font-weight: 600;
        font-size: 14px;
        padding: ${headerPadding};
        text-align: left;
        white-space: nowrap;
        border-right: ${showBorders ? "1px solid #e2e8f0" : "none"};
        background-color: #f8fafc;
        user-select: none;
        position: relative;

        &:last-child {
          border-right: none;
        }

        &:hover {
          background-color: #f1f5f9;
        }

        /* Resize handle */
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          cursor: col-resize;
          background: transparent;
          border-right: 2px solid transparent;
          transition: border-color 0.2s ease;
        }

        &:hover::after {
          border-right-color: #3b82f6;
        }

        /* Active resize indicator */
        &[data-resizing="true"]::after {
          border-right-color: #1d4ed8;
          background-color: rgba(59, 130, 246, 0.1);
        }
      `,
      Row: `
        border-bottom: ${showBorders ? "1px solid #f1f5f9" : "none"};
        transition: all 0.2s ease-in-out;
        background-color: ${stripedRows ? "transparent" : "white"};

        &:nth-child(even) {
          background-color: ${stripedRows ? "#f9fafb" : "white"};
        }

        &:hover {
          background-color: #f8fafc !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        &:last-child {
          border-bottom: none;
        }
      `,
      Cell: `
        padding: ${cellPadding};
        color: #334155;
        font-size: 14px;
        border-right: ${showBorders ? "1px solid #f1f5f9" : "none"};
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &:last-child {
          border-right: none;
        }

        &:hover {
          overflow: visible;
          white-space: normal;
          word-wrap: break-word;
        }
      `,
    },
  ]);

  const totalUsers = data.nodes.length;
  const filteredUsers = filteredData.nodes.length;

  return (
    <div className="max-w-7xl mx-auto min-h-screen p-4">
      <div className="my-6 w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-800">
              User Details
            </h2>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              {searchTerm
                ? `${filteredUsers} of ${totalUsers}`
                : `${totalUsers} users`}
            </Badge>
          </div>

          {/* Table Controls */}
          <div className="flex items-center space-x-4">
            {showSearch && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Height:</label>
              <select
                value={tableHeight}
                onChange={(e) => setTableHeight(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="400px">400px</option>
                <option value="600px">600px</option>
                <option value="800px">800px</option>
                <option value="100vh">Full Height</option>
              </select>
            </div>

            {showExport && (
              <button
                onClick={() => console.log("Export functionality")}
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export
              </button>
            )}
          </div>
        </div>

        {/* Table Container with Horizontal Scroll */}
        <div className="relative">
          <div
            className="table-container overflow-auto"
            style={{
              maxHeight: tableHeight,
              minHeight: "300px",
            }}
          >
            <Table
              className="react-table"
              data={filteredData}
              theme={theme}
              sort={sort}
              layout={{
                custom: true,
                horizontalScroll: true,
                fixedHeader: true,
              }}
            >
              {(tableList: UserNode[]) => (
                <>
                  <Header>
                    <HeaderRow>
                      {columns.map((column) => (
                        <HeaderCellSort
                          key={column.key}
                          resize={column.resizable !== false}
                          sortKey={column.sortable !== false ? column.key : ""}
                          style={{
                            width: column.width,
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                          }}
                        >
                          {column.label}
                        </HeaderCellSort>
                      ))}
                    </HeaderRow>
                  </Header>

                  <Body>
                    {tableList && tableList.length > 0 ? (
                      tableList.map((item: UserNode, index) => (
                        <Row
                          key={`user-${item.id}-${item.email}-${index}`}
                          item={item}
                        >
                          {columns.map((column) => (
                            <Cell key={`${item.id}-${column.key}`}>
                              {column.key === "ID" && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  #{item.id}
                                </span>
                              )}
                              {column.key === "NAME" && (
                                <div className="font-medium text-gray-900">
                                  {item.name || "N/A"}
                                </div>
                              )}
                              {column.key === "EMAIL" && (
                                <div
                                  className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                                  title={item.email}
                                >
                                  {item.email || "N/A"}
                                </div>
                              )}
                              {column.key === "AGE" && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {item.age || 0}
                                </span>
                              )}
                              {column.key === "CITY" && (
                                <div
                                  className="text-gray-700"
                                  title={item.city}
                                >
                                  {item.city || "N/A"}
                                </div>
                              )}
                              {column.key === "ADDRESS" && (
                                <div
                                  className="text-gray-700"
                                  title={item.address}
                                >
                                  {item.address || "N/A"}
                                </div>
                              )}
                            </Cell>
                          ))}
                        </Row>
                      ))
                    ) : (
                      <Row item={{} as UserNode}>
                        <Cell
                          style={{ textAlign: "center" }}
                          colSpan={columns.length}
                        >
                          <div className="py-12 text-center">
                            <div className="text-gray-400 text-lg mb-2">
                              {searchTerm ? "🔍" : "📋"}
                            </div>
                            <div className="text-gray-500 font-medium">
                              {searchTerm
                                ? "No matching users found"
                                : "No users found"}
                            </div>
                            <div className="text-gray-400 text-sm mt-1">
                              {searchTerm
                                ? "Try adjusting your search criteria"
                                : "No data available"}
                            </div>
                            {searchTerm && (
                              <button
                                onClick={() => setSearchTerm("")}
                                className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
                              >
                                Clear search
                              </button>
                            )}
                          </div>
                        </Cell>
                      </Row>
                    )}
                  </Body>
                </>
              )}
            </Table>
          </div>

          {/* Scroll Indicators */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50"></div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <div>
              Showing {filteredUsers} of {totalUsers} users
              {searchTerm && (
                <span className="ml-2 text-blue-600">
                  (filtered by &quot;{searchTerm}&quot;)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span>💡 Tip: Drag column borders to resize</span>
              {showSearch && <span>🔍 Use search to filter results</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactTable;
