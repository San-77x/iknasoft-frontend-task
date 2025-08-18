"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ExpandedState,
  RowSelectionState,
  Column,
  Row,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Search,
  Download,
  Trash2,
  Copy,
} from "lucide-react";

import { Deal, generateSampleDeals, Activity } from "@/types/table-types";
import {
  StatusBadge,
  PriorityBadge,
  StageBadge,
  TagBadge,
} from "@/components/table-ui/StatusBadge";
import ContextMenu, { useContextMenu } from "@/components/table-ui/ContextMenu";
import ColumnControls from "@/components/table-ui/ColumnControls";
import { useTableState } from "@/hooks/useTableState";

// Column helper for type safety
const columnHelper = createColumnHelper<Deal>();

// Editable cell component
interface EditableCellProps {
  getValue: () => unknown;
  row: Row<Deal>;
  column: Column<Deal>;
  table: {
    options: {
      meta?: {
        updateData: (
          rowIndex: number,
          columnId: string,
          value: unknown,
        ) => void;
      };
    };
  };
}

const EditableCell: React.FC<EditableCellProps> = ({
  getValue,
  row,
  column,
  table,
}) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const onBlur = () => {
    setIsEditing(false);
    table.options.meta?.updateData(row.index, column.id, value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onBlur();
    } else if (e.key === "Escape") {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-gray-50 p-1 rounded min-h-[24px]"
      title="Click to edit"
    >
      {value}
    </div>
  );
};

// Amount formatter
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Date formatter
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Expandable row content
const ExpandedRowContent: React.FC<{ deal: Deal }> = ({ deal }) => {
  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Contact Information
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Company:</span>{" "}
              {deal.contact.company}
            </div>
            <div>
              <span className="font-medium">Title:</span> {deal.contact.title}
            </div>
            <div>
              <span className="font-medium">Email:</span> {deal.contact.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {deal.contact.phone}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Recent Activities
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {deal.activities.map((activity: Activity) => (
              <div key={activity.id} className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <div className="font-medium">
                    {activity.type.charAt(0).toUpperCase() +
                      activity.type.slice(1)}
                  </div>
                  <div className="text-gray-600">{activity.description}</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(activity.date)} by {activity.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags and Notes */}
        <div className="md:col-span-2">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {deal.tags.map((tag, index) => (
                <TagBadge key={index} tag={tag} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
            <p className="text-sm text-gray-600">{deal.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Status selector dropdown
const StatusSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: string[];
}> = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 border rounded hover:bg-gray-50"
      >
        <StatusBadge status={value as any} />
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-20 min-w-[150px]">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
              >
                <StatusBadge status={option as any} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Column filter component
const ColumnFilter: React.FC<{
  column: Column<Deal, unknown>;
  placeholder?: string;
}> = ({ column, placeholder = "Filter..." }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 w-3 h-3 text-gray-400" />
      <input
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};

// Bulk actions toolbar
const BulkActionsToolbar: React.FC<{
  selectedRows: Row<Deal>[];
  onAction: (action: string) => void;
}> = ({ selectedRows, onAction }) => {
  if (selectedRows.length === 0) return null;

  return (
    <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <span className="text-sm font-medium text-blue-900">
        {selectedRows.length} row{selectedRows.length > 1 ? "s" : ""} selected
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onAction("export")}
          className="px-3 py-1.5 text-xs bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50"
        >
          <Download className="w-3 h-3 inline mr-1" />
          Export
        </button>
        <button
          onClick={() => onAction("duplicate")}
          className="px-3 py-1.5 text-xs bg-white border border-blue-300 text-blue-700 rounded hover:bg-blue-50"
        >
          <Copy className="w-3 h-3 inline mr-1" />
          Duplicate
        </button>
        <button
          onClick={() => onAction("delete")}
          className="px-3 py-1.5 text-xs bg-white border border-red-300 text-red-700 rounded hover:bg-red-50"
        >
          <Trash2 className="w-3 h-3 inline mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

const TanStackTable: React.FC = () => {
  const [data, setData] = useState(() => generateSampleDeals());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [isColumnControlsOpen, setIsColumnControlsOpen] = useState(false);

  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  // Table state management with persistence
  const { resetState } = useTableState({
    persistToStorage: true,
    defaultColumnVisibility: columnVisibility,
    defaultSorting: sorting,
    defaultFilters: columnFilters,
  });

  // Update data function for editable cells
  const updateData = useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      setData((old) =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex]!,
              [columnId]: value,
            };
          }
          return row;
        }),
      );
    },
    [],
  );

  // Define columns
  const columns = useMemo(
    () => [
      // Row selection
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="rounded border-gray-300 text-blue-600"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="rounded border-gray-300 text-blue-600"
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      }),

      // Row expansion
      columnHelper.display({
        id: "expand",
        header: () => null,
        cell: ({ row }) => (
          <button
            onClick={row.getToggleExpandedHandler()}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      }),

      // Deal name
      columnHelper.accessor("name", {
        header: "Deal Name",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell
            getValue={getValue}
            row={row}
            column={column}
            table={table}
          />
        ),
        size: 200,
        filterFn: "includesString",
      }),

      // Owner
      columnHelper.accessor("owner", {
        header: "Owner",
        cell: ({ getValue, row, column, table }) => (
          <EditableCell
            getValue={getValue}
            row={row}
            column={column}
            table={table}
          />
        ),
        size: 120,
        filterFn: "includesString",
      }),

      // Status with dropdown
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue, row }) => (
          <StatusSelector
            value={getValue()}
            onChange={(value) => updateData(row.index, "status", value)}
            options={[
              "New",
              "Qualified",
              "Proposal",
              "Negotiation",
              "Won",
              "Lost",
            ]}
          />
        ),
        size: 120,
        filterFn: "equals",
      }),

      // Stage
      columnHelper.accessor("stage", {
        header: "Stage",
        cell: ({ getValue }) => <StageBadge stage={getValue()} />,
        size: 100,
        filterFn: "equals",
      }),

      // Priority
      columnHelper.accessor("priority", {
        header: "Priority",
        cell: ({ getValue }) => <PriorityBadge priority={getValue()} />,
        size: 80,
        filterFn: "equals",
      }),

      // Amount
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: ({ getValue }) => (
          <span className="font-mono font-medium">
            {formatAmount(getValue())}
          </span>
        ),
        size: 120,
        filterFn: "inNumberRange",
      }),

      // Probability
      columnHelper.accessor("probability", {
        header: "Probability",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${getValue()}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">{getValue()}%</span>
          </div>
        ),
        size: 100,
      }),

      // Expected Close Date
      columnHelper.accessor("expectedCloseDate", {
        header: "Close Date",
        cell: ({ getValue }) => (
          <span className="text-sm">{formatDate(getValue())}</span>
        ),
        size: 100,
      }),

      // Created Date
      columnHelper.accessor("createdDate", {
        header: "Created",
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-600">
            {formatDate(getValue())}
          </span>
        ),
        size: 100,
      }),

      // Last Activity
      columnHelper.accessor("lastActivity", {
        header: "Last Activity",
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-600">
            {formatDate(getValue())}
          </span>
        ),
        size: 110,
      }),

      // Company
      columnHelper.accessor("contact.company", {
        id: "company",
        header: "Company",
        size: 150,
        filterFn: "includesString",
      }),

      // Actions
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={(e) =>
              showContextMenu(e, {
                type: "row",
                rowId: row.id,
                data: row.original,
              })
            }
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        ),
        size: 60,
        enableSorting: false,
        enableHiding: false,
      }),
    ],
    [updateData, showContextMenu],
  );

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: Deal) => undefined, // No sub-rows by default
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    meta: {
      updateData,
    },
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  // Handle context menu actions
  const handleContextAction = (
    action: string,
    data?: {
      columnId?: string;
      direction?: string;
      data?: Deal;
    },
  ) => {
    console.log("Context action:", action, data);

    switch (action) {
      case "sort":
        if (data.direction === "asc") {
          setSorting([{ id: data.columnId, desc: false }]);
        } else {
          setSorting([{ id: data.columnId, desc: true }]);
        }
        break;
      case "clearSort":
        setSorting([]);
        break;
      case "hideColumn":
        setColumnVisibility((prev) => ({ ...prev, [data.columnId]: false }));
        break;
      case "showAllColumns":
        setColumnVisibility({});
        break;
      case "viewDetails":
        console.log("View details for:", data.data);
        break;
      case "editRow":
        console.log("Edit row:", data.data);
        break;
      case "deleteRow":
        setData((prev) => prev.filter((row) => row.id !== data.data.id));
        break;
      default:
        console.log("Unhandled action:", action);
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    const selectedRowData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    switch (action) {
      case "export":
        console.log("Export selected rows:", selectedRowData);
        break;
      case "duplicate":
        console.log("Duplicate selected rows:", selectedRowData);
        break;
      case "delete":
        const selectedIds = selectedRowData.map((row) => row.id);
        setData((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
        setRowSelection({});
        break;
    }
  };

  // Calculate totals for numeric columns
  const totals = useMemo(() => {
    const preFilteredRows = table.getPreFilteredRowModel();
    const filteredData = preFilteredRows.rows.map((row) => row.original);
    return {
      totalAmount: filteredData.reduce((sum, row) => sum + row.amount, 0),
      averageAmount:
        filteredData.length > 0
          ? filteredData.reduce((sum, row) => sum + row.amount, 0) /
            filteredData.length
          : 0,
      averageProbability:
        filteredData.length > 0
          ? filteredData.reduce((sum, row) => sum + row.probability, 0) /
            filteredData.length
          : 0,
      count: filteredData.length,
    };
  }, [table]);

  // Keyboard navigation
  const [focusedCell, setFocusedCell] = useState<{
    rowIndex: number;
    columnId: string;
  } | null>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!focusedCell) return;

      const { rowIndex, columnId } = focusedCell;
      const rows = table.getRowModel().rows;
      const columns = table.getVisibleFlatColumns();
      const currentColumnIndex = columns.findIndex(
        (col) => col.id === columnId,
      );

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (rowIndex > 0) {
            setFocusedCell({ rowIndex: rowIndex - 1, columnId });
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (rowIndex < rows.length - 1) {
            setFocusedCell({ rowIndex: rowIndex + 1, columnId });
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (currentColumnIndex > 0) {
            setFocusedCell({
              rowIndex,
              columnId: columns[currentColumnIndex - 1].id,
            });
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (currentColumnIndex < columns.length - 1) {
            setFocusedCell({
              rowIndex,
              columnId: columns[currentColumnIndex + 1].id,
            });
          }
          break;
        case "Enter":
          e.preventDefault();
          // Trigger edit mode for the focused cell
          break;
        case "Escape":
          setFocusedCell(null);
          break;
      }
    },
    [focusedCell, table],
  );

  // Column info for controls
  const columnInfo = useMemo(
    () =>
      table
        .getAllColumns()
        .filter((col) => col.getCanHide())
        .map((col) => ({
          id: col.id,
          label:
            typeof col.columnDef.header === "string"
              ? col.columnDef.header
              : col.id,
          isVisible: col.getIsVisible(),
          canHide: col.getCanHide(),
        })),
    [table],
  );

  return (
    <div className="space-y-4">
      {/* Header with global search and controls */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Advanced Table</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ColumnControls
            columns={columnInfo}
            columnOrder={table.getAllColumns().map((col) => col.id)}
            onVisibilityChange={setColumnVisibility}
            onOrderChange={() => {}} // Column reordering would require more complex implementation
            onReset={resetState}
            isOpen={isColumnControlsOpen}
            onToggle={() => setIsColumnControlsOpen(!isColumnControlsOpen)}
          />

          <button
            onClick={() => console.log("Export all data")}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Bulk actions toolbar */}
      <BulkActionsToolbar
        selectedRows={table.getSelectedRowModel().rows}
        onAction={handleBulkAction}
      />

      {/* Table container with sticky header and horizontal scroll */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto" style={{ maxHeight: "70vh" }}>
          <table className="w-full" onKeyDown={handleKeyDown} tabIndex={0}>
            {/* Header */}
            <thead className="bg-gray-50 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                      style={{ width: header.getSize() }}
                      onContextMenu={(e) =>
                        showContextMenu(e, {
                          type: "column",
                          columnId: header.id,
                        })
                      }
                    >
                      <div className="space-y-2">
                        {/* Header content with sorting */}
                        <div className="flex items-center gap-2">
                          {header.isPlaceholder ? null : (
                            <>
                              <div
                                className={`flex items-center gap-1 ${
                                  header.column.getCanSort()
                                    ? "cursor-pointer select-none"
                                    : ""
                                }`}
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                                {header.column.getCanSort() && (
                                  <span className="text-gray-400">
                                    {{
                                      asc: <ArrowUp className="w-3 h-3" />,
                                      desc: <ArrowDown className="w-3 h-3" />,
                                    }[
                                      header.column.getIsSorted() as string
                                    ] ?? <ArrowUpDown className="w-3 h-3" />}
                                  </span>
                                )}
                              </div>

                              {/* Multi-sort indicator */}
                              {header.column.getIsSorted() &&
                                table.getState().sorting.length > 1 && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                                    {table
                                      .getState()
                                      .sorting.findIndex(
                                        (s) => s.id === header.id,
                                      ) + 1}
                                  </span>
                                )}
                            </>
                          )}
                        </div>

                        {/* Column filter */}
                        {header.column.getCanFilter() && (
                          <ColumnFilter column={header.column} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            {/* Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr
                    className={`hover:bg-gray-50 ${row.getIsSelected() ? "bg-blue-50" : ""}`}
                    onContextMenu={(e) =>
                      showContextMenu(e, {
                        type: "row",
                        rowId: row.id,
                        data: row.original,
                      })
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-4 py-3 whitespace-nowrap text-sm ${
                          focusedCell?.rowIndex === row.index &&
                          focusedCell?.columnId === cell.column.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() =>
                          setFocusedCell({
                            rowIndex: row.index,
                            columnId: cell.column.id,
                          })
                        }
                        tabIndex={0}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Expanded row content */}
                  {row.getIsExpanded() && (
                    <tr>
                      <td colSpan={row.getVisibleCells().length}>
                        <ExpandedRowContent deal={row.original} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

              {/* Totals row */}
              <tr className="bg-gray-100 font-medium sticky bottom-0">
                <td className="px-4 py-3 text-sm">Totals</td>
                <td className="px-4 py-3 text-sm"></td>
                <td className="px-4 py-3 text-sm">{totals.count} deals</td>
                <td className="px-4 py-3 text-sm"></td>
                <td className="px-4 py-3 text-sm"></td>
                <td className="px-4 py-3 text-sm"></td>
                <td className="px-4 py-3 text-sm"></td>
                <td className="px-4 py-3 text-sm">
                  {formatAmount(totals.totalAmount)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {Math.round(totals.averageProbability)}%
                </td>
                <td colSpan={100} className="px-4 py-3 text-sm"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[10, 25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700">rows</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              First
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Last
            </button>
          </div>

          <div className="text-sm text-gray-700">
            Showing {table.getRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} entries
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <ContextMenu
        position={contextMenu.position}
        data={contextMenu.data}
        onClose={hideContextMenu}
        onAction={handleContextAction}
        isVisible={contextMenu.isVisible}
      />

      {/* Keyboard shortcuts help */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>
          <strong>Keyboard shortcuts:</strong>
        </div>
        <div>• Arrow keys: Navigate cells</div>
        <div>• Enter: Edit cell</div>
        <div>• Escape: Cancel edit/clear focus</div>
        <div>• Ctrl/Cmd + Click: Multi-select rows</div>
        <div>• Shift + Click: Add sorting level</div>
        <div>• Right-click: Context menu</div>
      </div>
    </div>
  );
};

export default TanStackTable;
