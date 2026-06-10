"use client";
import { Box, Flex, Heading, Button, Alert, Table, HStack, Text, Checkbox } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import SelectField from "@/component/molecules/field/SelectField";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getItems } from "@/const/function/getItems";
import { updateItem } from "@/const/function/updateItem";
import type { TableRow } from "@/const/type/table/TableColumnType";

const ROLE_OPTIONS = [
  { label: "なし", value: "common" },
  { label: "ユーザー", value: "general" },
  { label: "管理者", value: "admin" },
] as const;

const ROLE_LABEL: Record<string, string> = {
  common: "なし",
  general: "ユーザー",
  admin: "管理者",
};

export default function UserRoleListTemplate() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [bulkRole, setBulkRole] = useState("common");
  const [isUpdating, setIsUpdating] = useState(false);
  const { error, handleError } = useErrorHandler();
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems<TableRow>("user-role");
        setRows(data);
      } catch (err) {
        handleError(err);
      }
    };
    fetchItems();
  }, []);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (checkedIds.size === rows.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(rows.map((r) => String(r.id))));
    }
  };

  const handleBulkUpdate = async () => {
    if (checkedIds.size === 0) return;
    setIsUpdating(true);
    try {
      await Promise.all(
        [...checkedIds].map((id) => {
          const row = rows.find((r) => String(r.id) === id);
          return updateItem("user-role", id, { role: bulkRole }, (row?.updated_at as string) ?? null);
        })
      );
      setRows((prev) =>
        prev.map((r) => (checkedIds.has(String(r.id)) ? { ...r, role: bulkRole } : r))
      );
      setCheckedIds(new Set());
    } catch (err) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const allChecked = rows.length > 0 && checkedIds.size === rows.length;
  const indeterminate = checkedIds.size > 0 && checkedIds.size < rows.length;

  return (
    <AdminLayoutTemplate title="ロール管理">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">ロール管理</Heading>
      </Flex>
      {error && (
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      )}
      <Box bg="white" borderRadius="md" shadow="sm" overflow="hidden" mb={4}>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="40px">
                <Checkbox.Root
                  checked={indeterminate ? "indeterminate" : allChecked}
                  onCheckedChange={toggleAll}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.ColumnHeader>
              <Table.ColumnHeader>表示名</Table.ColumnHeader>
              <Table.ColumnHeader>ロール</Table.ColumnHeader>
              <Table.ColumnHeader>操作</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => {
              const id = String(row.id);
              return (
                <Table.Row key={id}>
                  <Table.Cell>
                    <Checkbox.Root
                      checked={checkedIds.has(id)}
                      onCheckedChange={() => toggleCheck(id)}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  </Table.Cell>
                  <Table.Cell>{String(row.display_name ?? "")}</Table.Cell>
                  <Table.Cell>{ROLE_LABEL[String(row.role)] ?? String(row.role ?? "")}</Table.Cell>
                  <Table.Cell>
                    <Button size="sm" variant="outline" onClick={() => router.push(`/user-role/${id}`)}>
                      編集
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>
      {checkedIds.size > 0 && (
        <Box bg="white" borderRadius="md" shadow="sm" p={4}>
          <Text fontSize="sm" mb={3} color="gray.600">
            {checkedIds.size}件を選択中
          </Text>
          <HStack gap={4} align="flex-end">
            <Box w="160px">
              <SelectField
                label="変更するロール"
                value={bulkRole}
                onChange={setBulkRole}
                options={ROLE_OPTIONS}
              />
            </Box>
            <Button colorPalette="blue" onClick={handleBulkUpdate} loading={isUpdating}>
              変更
            </Button>
          </HStack>
        </Box>
      )}
    </AdminLayoutTemplate>
  );
}
