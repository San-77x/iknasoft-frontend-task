"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Copy,
  Edit,
  Trash2,
  Filter,
  Pin,
  Columns,
  Download,
} from "lucide-react";
import { ContextMenuPosition, ContextMenuData } from "@/types/table-types";

interface ContextMenuProps {
  position: ContextMenuPosition;
  data: ContextMenuData;
  onClose: () => void;
  onAction: (action: string, data?: any) => void;
  isVisible: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode | null;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  data,
  onClose,
  onAction,
  isVisible,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getColumnMenuItems = (): MenuItem[] => [
    {
      id: "sort-asc",
      label: "Sort Ascending",
      icon: <ArrowUp className="w-4 h-4" />,
      action: () =>
        onAction("sort", { columnId: data.columnId, direction: "asc" }),
    },
    {
      id: "sort-desc",
      label: "Sort Descending",
      icon: <ArrowDown className="w-4 h-4" />,
      action: () =>
        onAction("sort", { columnId: data.columnId, direction: "desc" }),
    },
    {
      id: "clear-sort",
      label: "Clear Sort",
      icon: <ArrowUpDown className="w-4 h-4" />,
      action: () => onAction("clearSort", { columnId: data.columnId }),
    },
    {
      id: "separator-1",
      label: "",
      icon: null,
      action: () => {},
      separator: true,
    },
    {
      id: "filter",
      label: "Add Filter",
      icon: <Filter className="w-4 h-4" />,
      action: () => onAction("filter", { columnId: data.columnId }),
    },
    {
      id: "pin-left",
      label: "Pin Left",
      icon: <Pin className="w-4 h-4" />,
      action: () => onAction("pinLeft", { columnId: data.columnId }),
    },
    {
      id: "pin-right",
      label: "Pin Right",
      icon: <Pin className="w-4 h-4" />,
      action: () => onAction("pinRight", { columnId: data.columnId }),
    },
    {
      id: "separator-2",
      label: "",
      icon: null,
      action: () => {},
      separator: true,
    },
    {
      id: "hide-column",
      label: "Hide Column",
      icon: <EyeOff className="w-4 h-4" />,
      action: () => onAction("hideColumn", { columnId: data.columnId }),
    },
    {
      id: "show-all-columns",
      label: "Show All Columns",
      icon: <Eye className="w-4 h-4" />,
      action: () => onAction("showAllColumns"),
    },
    {
      id: "column-settings",
      label: "Column Settings",
      icon: <Columns className="w-4 h-4" />,
      action: () => onAction("columnSettings"),
    },
  ];

  const getRowMenuItems = (): MenuItem[] => [
    {
      id: "view-details",
      label: "View Details",
      icon: <Eye className="w-4 h-4" />,
      action: () =>
        onAction("viewDetails", { rowId: data.rowId, data: data.data }),
    },
    {
      id: "edit-row",
      label: "Edit",
      icon: <Edit className="w-4 h-4" />,
      action: () => onAction("editRow", { rowId: data.rowId, data: data.data }),
    },
    {
      id: "duplicate-row",
      label: "Duplicate",
      icon: <Copy className="w-4 h-4" />,
      action: () =>
        onAction("duplicateRow", { rowId: data.rowId, data: data.data }),
    },
    {
      id: "separator-1",
      label: "",
      icon: null,
      action: () => {},
      separator: true,
    },
    {
      id: "export-row",
      label: "Export Row",
      icon: <Download className="w-4 h-4" />,
      action: () =>
        onAction("exportRow", { rowId: data.rowId, data: data.data }),
    },
    {
      id: "separator-2",
      label: "",
      icon: null,
      action: () => {},
      separator: true,
    },
    {
      id: "delete-row",
      label: "Delete",
      icon: <Trash2 className="w-4 h-4 text-red-600" />,
      action: () =>
        onAction("deleteRow", { rowId: data.rowId, data: data.data }),
    },
  ];

  const menuItems =
    data.type === "column" ? getColumnMenuItems() : getRowMenuItems();

  // Adjust position if menu would go off screen
  const adjustPosition = () => {
    if (!menuRef.current) return position;

    const rect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = position.x;
    let adjustedY = position.y;

    // Adjust horizontal position
    if (position.x + rect.width > viewportWidth) {
      adjustedX = viewportWidth - rect.width - 10;
    }

    // Adjust vertical position
    if (position.y + rect.height > viewportHeight) {
      adjustedY = viewportHeight - rect.height - 10;
    }

    return { x: Math.max(10, adjustedX), y: Math.max(10, adjustedY) };
  };

  const finalPosition = adjustPosition();

  const menuContent = (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] max-w-[250px]"
      style={{
        left: finalPosition.x,
        top: finalPosition.y,
      }}
    >
      {menuItems.map((item, index) => {
        if (item.separator) {
          return (
            <div key={`separator-${index}`} className="h-px bg-gray-200 my-1" />
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => {
              item.action();
              onClose();
            }}
            disabled={item.disabled}
            className={`
              w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50
              transition-colors duration-150 text-sm
              ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${item.id === "delete-row" ? "text-red-600 hover:bg-red-50" : "text-gray-700"}
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  // Render in portal to avoid z-index issues
  return createPortal(menuContent, document.body);
};

export default ContextMenu;

// Hook for managing context menu state
export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = React.useState<{
    isVisible: boolean;
    position: ContextMenuPosition;
    data: ContextMenuData;
  }>({
    isVisible: false,
    position: { x: 0, y: 0 },
    data: { type: "row" },
  });

  const showContextMenu = React.useCallback(
    (event: React.MouseEvent, data: ContextMenuData) => {
      event.preventDefault();
      event.stopPropagation();

      setContextMenu({
        isVisible: true,
        position: { x: event.clientX, y: event.clientY },
        data,
      });
    },
    [],
  );

  const hideContextMenu = React.useCallback(() => {
    setContextMenu((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  };
};
