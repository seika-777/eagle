"use client";
import { Box, Flex, Heading, Button, Alert } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import ItemTable from "@/component/organisms/ItemTable";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { configMap } from "@/const/config/index";
import { getItems } from "@/const/function/getItems";
import { deleteItem } from "@/const/function/deleteItem";
import { updateItem } from "@/const/function/updateItem";
import type { TableRow, RowValue } from "@/const/type/table/TableColumnType";

type Props = {
  type: string;
};

export default function ItemListTemplate({ type }: Props) {
  const config = configMap[type];
  const [rows, setRows] = useState<TableRow[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const { error, handleError } = useErrorHandler();
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems<TableRow>(config.apiType);
        setRows(data);
      } catch (err) {
        handleError(err);
      }
    };
    fetchItems();
  }, [type, refreshKey]);

  const handleCellChange = async (id: number | string, key: string, value: RowValue) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    try {
      await updateItem(config.apiType, String(id), { [key]: value }, (row.updated_at as string) ?? null);
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
    } catch (err) {
      handleError(err);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm(config.deleteConfirm)) return;
    try {
      await deleteItem(config.apiType, id);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <AdminLayoutTemplate title={config.listTitle}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">{config.listTitle}</Heading>
        {!config.hideAdd && (
          <Button
            colorPalette="blue"
            size="sm"
            onClick={() => router.push(`/${config.apiType}/new`)}
          >
            {config.addLabel}
          </Button>
        )}
      </Flex>
      {error && (
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      )}
      <Box bg="white" borderRadius="md" shadow="sm" overflow="hidden">
        <ItemTable
          columns={config.columns}
          spColumns={config.spColumns}
          rows={rows}
          editBasePath={`/${config.apiType}`}
          onDelete={handleDelete}
          onCellChange={config.inlineCellChange ? handleCellChange : undefined}
          hideDelete={config.hideDelete}
        />
      </Box>
    </AdminLayoutTemplate>
  );
}
