"use client";
import { Box, Heading, Button, HStack, Alert } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import ItemForm from "@/component/organisms/ItemForm";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { configMap } from "@/const/config/index";
import { getItem } from "@/const/function/getItem";
import { createItem } from "@/const/function/createItem";
import { updateItem } from "@/const/function/updateItem";
import type { FormRecord } from "@/const/type/config/EntityConfigType";
import type { TableRow } from "@/const/type/table/TableColumnType";

type Props = {
  type: string;
  id: string;
  dynamicOptions?: Record<string, readonly { label: string; value: string | number }[]>;
};

export default function ItemEditTemplate({ type, id, dynamicOptions }: Props) {
  const config = configMap[type];
  const isNew = id === "new";
  const [form, setForm] = useState<FormRecord>(config?.initialForm ?? {});
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();
  const router = useRouter();

  useEffect(() => {
    if (!isNew && config) {
      const fetchItem = async () => {
        try {
          const data = await getItem<TableRow>(config.apiType, id);
          setForm(config.toForm(data));
          setUpdatedAt((data.updated_at as string) ?? null);
        } catch (err) {
          handleError(err);
        }
      };
      fetchItem();
    }
  }, [type, id, isNew]);

  const handleChange = (key: string, value: FormRecord[string]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!config) return;
    clearError();
    setIsSaving(true);
    try {
      if (isNew) {
        await createItem(config.apiType, config.toBody(form));
      } else {
        await updateItem(config.apiType, id, config.toBody(form), updatedAt);
      }
      router.push(`/${config.apiType}`);
    } catch (err) {
      handleError(err);
    } finally {
      setIsSaving(false);
    }
  };

  const title = isNew ? (config?.addLabel ?? "") : (config?.editTitle ?? "");
  const listPath = `/${type}`;

  return (
    <AdminLayoutTemplate title={title}>
      <Heading size="md" mb={4}>{title}</Heading>
      <Box bg="white" borderRadius="md" shadow="sm" p={6}>
        {error && (
          <Alert.Root status="error" mb={4}>
            <Alert.Indicator />
            <Alert.Description>{error}</Alert.Description>
          </Alert.Root>
        )}
        {config && (
          <ItemForm
            formItems={config.formItems}
            form={form}
            onChange={handleChange}
            dynamicOptions={dynamicOptions}
          />
        )}
        <HStack mt={6} justify="flex-end" gap={3}>
          <Button variant="outline" onClick={() => router.push(listPath)}>
            キャンセル
          </Button>
          <Button colorPalette="blue" onClick={handleSave} loading={isSaving} disabled={!config}>
            保存
          </Button>
        </HStack>
      </Box>
    </AdminLayoutTemplate>
  );
}
