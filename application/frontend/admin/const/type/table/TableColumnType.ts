import type { ReactNode } from "react";

export type RowValue = string | number | boolean | null | string[] | number[] | Record<string, string | number | boolean | null> | Record<string, string | number | boolean | null>[];
export type TableRow = Record<string, RowValue>;

export type TableColumnType = {
  key: string;
  label: string;
  render?: (value: RowValue, row: TableRow, onChange?: (value: RowValue) => void) => ReactNode;
};
