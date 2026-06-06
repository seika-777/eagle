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
import type { TableRow } from "@/const/type/table/TableColumnType";

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

  const handleDelete = async (id: number) => {
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
        <Button
          colorPalette="blue"
          size="sm"
          onClick={() => router.push(`/${config.apiType}/new`)}
        >
          {config.addLabel}
        </Button>
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
        />
      </Box>
    </AdminLayoutTemplate>
  );
}
