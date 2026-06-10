"use client";
import { Table, Button, HStack, useBreakpointValue } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import type { TableColumnType, TableRow } from "@/const/type/table/TableColumnType";

type Props = {
  columns: TableColumnType[];
  spColumns?: TableColumnType[];
  rows: TableRow[];
  editBasePath: string;
  onDelete: (id: number | string) => void;
  onCellChange?: (id: number | string, key: string, value: RowValue) => void;
  hideDelete?: boolean;
};

export default function ItemTable({ columns, spColumns, rows, editBasePath, onDelete, onCellChange, hideDelete }: Props) {
  const router = useRouter();
  const isSP = useBreakpointValue({ base: true, md: false }) ?? false;
  const visibleColumns = isSP && spColumns ? spColumns : columns;

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          {visibleColumns.map((col) => (
            <Table.ColumnHeader key={col.key}>{col.label}</Table.ColumnHeader>
          ))}
          <Table.ColumnHeader>操作</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={String(row.id)}>
            {visibleColumns.map((col) => (
              <Table.Cell key={col.key}>
                {col.render
                  ? col.render(
                      row[col.key],
                      row,
                      onCellChange ? (v) => onCellChange(row.id as number | string, col.key, v) : undefined
                    )
                  : String(row[col.key] ?? "")}
              </Table.Cell>
            ))}
            <Table.Cell>
              <HStack gap={2}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`${editBasePath}/${row.id}`)}
                >
                  編集
                </Button>
                {!hideDelete && (
                  <Button
                    size="sm"
                    colorPalette="red"
                    variant="outline"
                    onClick={() => onDelete(row.id as number | string)}
                  >
                    削除
                  </Button>
                )}
              </HStack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
