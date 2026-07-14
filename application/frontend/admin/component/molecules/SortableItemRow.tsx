"use client";
import { Table, Button, HStack, IconButton } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuGripVertical } from "react-icons/lu";
import type { TableColumnType, TableRow } from "@/const/type/table/TableColumnType";

type Props = {
  row: TableRow;
  columns: TableColumnType[];
  onEdit: () => void;
  onDelete: () => void;
  hideDelete?: boolean;
};

export default function SortableItemRow({ row, columns, onEdit, onDelete, hideDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: Number(row.id),
  });

  return (
    <Table.Row
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      opacity={isDragging ? 0.5 : 1}
      bg={isDragging ? "gray.50" : undefined}
    >
      <Table.Cell w="40px">
        <IconButton
          size="xs"
          variant="ghost"
          aria-label="並び替え"
          cursor="grab"
          {...attributes}
          {...listeners}
        >
          <LuGripVertical />
        </IconButton>
      </Table.Cell>
      {columns.map((col) => (
        <Table.Cell key={col.key}>
          {col.render ? col.render(row[col.key], row, undefined) : String(row[col.key] ?? "")}
        </Table.Cell>
      ))}
      <Table.Cell>
        <HStack gap={2}>
          <Button size="sm" variant="outline" onClick={onEdit}>
            編集
          </Button>
          {!hideDelete && (
            <Button size="sm" colorPalette="red" variant="outline" onClick={onDelete}>
              削除
            </Button>
          )}
        </HStack>
      </Table.Cell>
    </Table.Row>
  );
}
