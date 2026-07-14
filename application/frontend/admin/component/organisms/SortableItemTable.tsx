"use client";
import { Table, useBreakpointValue } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import SortableItemRow from "@/component/molecules/SortableItemRow";
import type { TableColumnType, TableRow } from "@/const/type/table/TableColumnType";

type Props = {
  columns: TableColumnType[];
  spColumns?: TableColumnType[];
  rows: TableRow[];
  editBasePath: string;
  onDelete: (id: number | string) => void;
  onReorder: (orderedIds: number[]) => void;
  hideDelete?: boolean;
};

export default function SortableItemTable({ columns, spColumns, rows, editBasePath, onDelete, onReorder, hideDelete }: Props) {
  const router = useRouter();
  const isSP = useBreakpointValue({ base: true, md: false }) ?? false;
  const visibleColumns = isSP && spColumns ? spColumns : columns;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((r) => Number(r.id) === Number(active.id));
    const newIndex = rows.findIndex((r) => Number(r.id) === Number(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(rows, oldIndex, newIndex).map((r: TableRow) => Number(r.id)));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={rows.map((r) => Number(r.id))} strategy={verticalListSortingStrategy}>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="40px" />
              {visibleColumns.map((col) => (
                <Table.ColumnHeader key={col.key}>{col.label}</Table.ColumnHeader>
              ))}
              <Table.ColumnHeader>操作</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <SortableItemRow
                key={String(row.id)}
                row={row}
                columns={visibleColumns}
                onEdit={() => router.push(`${editBasePath}/${row.id}`)}
                onDelete={() => onDelete(row.id as number | string)}
                hideDelete={hideDelete}
              />
            ))}
          </Table.Body>
        </Table.Root>
      </SortableContext>
    </DndContext>
  );
}
