"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Settings,
  Eye,
  EyeOff,
  GripVertical,
  RotateCcw,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { VisibilityState } from "@tanstack/react-table";

interface ColumnInfo {
  id: string;
  label: string;
  isVisible: boolean;
  canHide?: boolean;
}

interface ColumnControlsProps {
  columns: ColumnInfo[];
  columnOrder: string[];
  onVisibilityChange: (visibility: VisibilityState) => void;
  onOrderChange: (columnOrder: string[]) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface SortableColumnItemProps {
  column: ColumnInfo;
  onToggleVisibility: (columnId: string) => void;
}

const SortableColumnItem: React.FC<SortableColumnItemProps> = ({
  column,
  onToggleVisibility,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    disabled: column.canHide === false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 p-2 rounded-md mb-1
        ${isDragging ? "bg-blue-100 shadow-md z-10" : "hover:bg-gray-50"}
        ${column.canHide === false ? "opacity-75" : ""}
      `}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className={`
          cursor-grab active:cursor-grabbing text-gray-400
          ${column.canHide === false ? "cursor-not-allowed opacity-50" : "hover:text-gray-600"}
        `}
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Visibility toggle */}
      <button
        onClick={() => onToggleVisibility(column.id)}
        disabled={column.canHide === false}
        className={`
          p-1 rounded hover:bg-gray-200 focus:outline-none
          ${column.canHide === false ? "cursor-not-allowed opacity-50" : ""}
        `}
        title={
          column.canHide === false
            ? "This column cannot be hidden"
            : "Toggle visibility"
        }
      >
        {column.isVisible ? (
          <Eye className="w-4 h-4 text-green-600" />
        ) : (
          <EyeOff className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Column label */}
      <span
        className={`
        flex-1 text-sm
        ${column.isVisible ? "text-gray-900" : "text-gray-500"}
        ${column.canHide === false ? "font-medium" : ""}
      `}
      >
        {column.label}
        {column.canHide === false && (
          <span className="ml-2 text-xs text-blue-600">(Required)</span>
        )}
      </span>
    </div>
  );
};

const ColumnControls: React.FC<ColumnControlsProps> = ({
  columns,
  columnOrder,
  onVisibilityChange,
  onOrderChange,
  onReset,
  isOpen,
  onToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Get ordered columns based on current order
  const orderedColumns = React.useMemo(() => {
    const columnMap = new Map(columns.map((col) => [col.id, col]));
    const ordered = columnOrder
      .map((id) => columnMap.get(id))
      .filter(Boolean) as ColumnInfo[];

    // Add any columns not in the order array
    columns.forEach((col) => {
      if (!columnOrder.includes(col.id)) {
        ordered.push(col);
      }
    });

    return ordered;
  }, [columns, columnOrder]);

  // Filter columns based on search
  const filteredColumns = orderedColumns.filter((column) =>
    column.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over?.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
        onOrderChange(newOrder);
      }
    }
  };

  const toggleColumnVisibility = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column || column.canHide === false) return;

    const newVisibility: VisibilityState = {};
    columns.forEach((col) => {
      newVisibility[col.id] =
        col.id === columnId ? !col.isVisible : col.isVisible;
    });
    onVisibilityChange(newVisibility);
  };

  const toggleAllColumns = (visible: boolean) => {
    const newVisibility: VisibilityState = {};
    columns.forEach((col) => {
      newVisibility[col.id] = col.canHide === false ? true : visible;
    });
    onVisibilityChange(newVisibility);
  };

  const visibleCount = columns.filter((col) => col.isVisible).length;
  const hiddenCount = columns.length - visibleCount;

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        title="Column Settings"
      >
        <Settings className="w-4 h-4" />
        Columns
        {hiddenCount > 0 && (
          <span className="ml-1 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
            {hiddenCount} hidden
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onToggle}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80 max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Column Settings</h3>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200">
          {/* Search */}
          <input
            type="text"
            placeholder="Search columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Quick actions */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              <button
                onClick={() => toggleAllColumns(true)}
                className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 focus:outline-none"
              >
                Show All
              </button>
              <button
                onClick={() => toggleAllColumns(false)}
                className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 focus:outline-none"
              >
                Hide All
              </button>
            </div>
            <button
              onClick={onReset}
              className="text-xs px-2 py-1 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 focus:outline-none flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Status */}
          <div className="mt-2 text-xs text-gray-500">
            {visibleCount} visible, {hiddenCount} hidden
          </div>
        </div>

        {/* Column list */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredColumns.map((col) => col.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredColumns.map((column) => (
                  <SortableColumnItem
                    key={column.id}
                    column={column}
                    onToggleVisibility={toggleColumnVisibility}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {filteredColumns.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No columns found matching &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnControls;

// Simplified version without drag-and-drop for basic use cases
export const SimpleColumnControls: React.FC<{
  columns: ColumnInfo[];
  onVisibilityChange: (visibility: VisibilityState) => void;
  onReset: () => void;
}> = ({ columns, onVisibilityChange, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumnVisibility = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column || column.canHide === false) return;

    const newVisibility: VisibilityState = {};
    columns.forEach((col) => {
      newVisibility[col.id] =
        col.id === columnId ? !col.isVisible : col.isVisible;
    });
    onVisibilityChange(newVisibility);
  };

  const visibleCount = columns.filter((col) => col.isVisible).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Settings className="w-4 h-4" />
        Columns ({visibleCount})
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-64 max-h-80 overflow-y-auto">
            <div className="p-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Visible Columns</span>
                <button
                  onClick={onReset}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="p-2">
              {columns.map((column) => (
                <label
                  key={column.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={column.isVisible}
                    onChange={() => toggleColumnVisibility(column.id)}
                    disabled={column.canHide === false}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={`text-sm ${column.canHide === false ? "font-medium text-blue-600" : ""}`}
                  >
                    {column.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
