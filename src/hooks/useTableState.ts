"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { TableState } from "@/types/table-types";

const STORAGE_KEY = "advanced-table-state";

interface UseTableStateOptions {
  persistToStorage?: boolean;
  defaultColumnVisibility?: VisibilityState;
  defaultSorting?: SortingState;
  defaultFilters?: ColumnFiltersState;
  defaultColumnOrder?: string[];
  defaultColumnWidths?: { [key: string]: number };
}

export const useTableState = (options: UseTableStateOptions = {}) => {
  const {
    persistToStorage = true,
    defaultColumnVisibility = {},
    defaultSorting = [],
    defaultFilters = [],
    defaultColumnOrder = [],
    defaultColumnWidths = {},
  } = options;

  // Load initial state from localStorage if persistence is enabled
  const loadInitialState = useCallback((): TableState => {
    if (!persistToStorage || typeof window === "undefined") {
      return {
        columnVisibility: defaultColumnVisibility,
        columnOrder: defaultColumnOrder,
        sorting: defaultSorting,
        filters: defaultFilters,
        columnWidths: defaultColumnWidths,
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          columnVisibility: parsed.columnVisibility || defaultColumnVisibility,
          columnOrder: parsed.columnOrder || defaultColumnOrder,
          sorting: parsed.sorting || defaultSorting,
          filters: parsed.filters || defaultFilters,
          columnWidths: parsed.columnWidths || defaultColumnWidths,
        };
      }
    } catch (error) {
      console.warn("Failed to load table state from localStorage:", error);
    }

    return {
      columnVisibility: defaultColumnVisibility,
      columnOrder: defaultColumnOrder,
      sorting: defaultSorting,
      filters: defaultFilters,
      columnWidths: defaultColumnWidths,
    };
  }, [
    persistToStorage,
    defaultColumnVisibility,
    defaultSorting,
    defaultFilters,
    defaultColumnOrder,
    defaultColumnWidths,
  ]);

  const [tableState, setTableState] = useState<TableState>(loadInitialState);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (persistToStorage && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tableState));
      } catch (error) {
        console.warn("Failed to save table state to localStorage:", error);
      }
    }
  }, [tableState, persistToStorage]);

  const updateColumnVisibility = useCallback((visibility: VisibilityState) => {
    setTableState((prev) => ({ ...prev, columnVisibility: visibility }));
  }, []);

  const updateSorting = useCallback((sorting: SortingState) => {
    setTableState((prev) => ({ ...prev, sorting }));
  }, []);

  const updateFilters = useCallback((filters: ColumnFiltersState) => {
    setTableState((prev) => ({ ...prev, filters }));
  }, []);

  const updateColumnOrder = useCallback((columnOrder: string[]) => {
    setTableState((prev) => ({ ...prev, columnOrder }));
  }, []);

  const updateColumnWidths = useCallback(
    (columnWidths: { [key: string]: number }) => {
      setTableState((prev) => ({ ...prev, columnWidths }));
    },
    [],
  );

  const updateColumnWidth = useCallback((columnId: string, width: number) => {
    setTableState((prev) => ({
      ...prev,
      columnWidths: { ...prev.columnWidths, [columnId]: width },
    }));
  }, []);

  const resetState = useCallback(() => {
    const resetState: TableState = {
      columnVisibility: defaultColumnVisibility,
      columnOrder: defaultColumnOrder,
      sorting: defaultSorting,
      filters: defaultFilters,
      columnWidths: defaultColumnWidths,
    };
    setTableState(resetState);

    if (persistToStorage && typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [
    defaultColumnVisibility,
    defaultSorting,
    defaultFilters,
    defaultColumnOrder,
    defaultColumnWidths,
    persistToStorage,
  ]);

  return {
    tableState,
    updateColumnVisibility,
    updateSorting,
    updateFilters,
    updateColumnOrder,
    updateColumnWidths,
    updateColumnWidth,
    resetState,
  };
};

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(value as T) : value;
        setValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key],
  );

  return [value, setStoredValue] as const;
};
