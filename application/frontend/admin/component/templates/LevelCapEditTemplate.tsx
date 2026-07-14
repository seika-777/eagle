"use client";
import { Box, Heading, Button, HStack, Alert, Separator, Spinner, Tabs, Text, Table, Input, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { levelCapConfig } from "@/const/config/levelCap";
import { getLevelCaps } from "@/const/function/getLevelCaps";
import { updateLevelCaps } from "@/const/function/updateLevelCaps";
import { LEVEL_CAP_EDIT } from "@/const/pages/LEVEL_CAP_EDIT";
import type { LevelCapFormRowType } from "@/const/type/levelCap/LevelCapFormRowType";
import type { LevelCapSectionType } from "@/const/type/config/LevelCapConfigType";

export default function LevelCapEditTemplate() {
  const [rowsByBelt, setRowsByBelt] = useState<Record<string, LevelCapFormRowType[]>>({
    [LEVEL_CAP_EDIT.VALUE.BELT_B]: [],
    [LEVEL_CAP_EDIT.VALUE.BELT_C]: [],
  });
  const [belt, setBelt] = useState<string>(LEVEL_CAP_EDIT.VALUE.BELT_B);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    const fetchLevelCaps = async () => {
      try {
        const [dataB, dataC] = await Promise.all([
          getLevelCaps(LEVEL_CAP_EDIT.VALUE.BELT_B),
          getLevelCaps(LEVEL_CAP_EDIT.VALUE.BELT_C),
        ]);
        setRowsByBelt({
          [LEVEL_CAP_EDIT.VALUE.BELT_B]: levelCapConfig.toForm(dataB),
          [LEVEL_CAP_EDIT.VALUE.BELT_C]: levelCapConfig.toForm(dataC),
        });
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLevelCaps();
  }, []);

  const handleChange = (beltKey: string, rowId: number, column: string, value: string) => {
    setRowsByBelt((prev) => ({
      ...prev,
      [beltKey]: (prev[beltKey] ?? []).map((row) =>
        row.id === rowId ? { ...row, values: { ...row.values, [column]: value } } : row
      ),
    }));
  };

  const validate = (): string | null => {
    const belts = [LEVEL_CAP_EDIT.VALUE.BELT_B, LEVEL_CAP_EDIT.VALUE.BELT_C];
    for (const beltKey of belts) {
      const beltLabel = beltKey === LEVEL_CAP_EDIT.VALUE.BELT_B ? LEVEL_CAP_EDIT.TEXT.TAB_B : LEVEL_CAP_EDIT.TEXT.TAB_C;
      for (const row of rowsByBelt[beltKey] ?? []) {
        for (const section of levelCapConfig.formSections) {
          for (const field of section.fields) {
            const value = (row.values[field.column] ?? "").trim();
            const parsed = levelCapConfig.parseInteger(value);
            if (field.valueType === "requiredInt") {
              if (parsed === null) {
                return `${beltLabel} ${LEVEL_CAP_EDIT.TEXT.LEVEL_PREFIX}${row.level} ${field.label}${LEVEL_CAP_EDIT.TEXT.ERROR_REQUIRED_INT}`;
              }
              if (Math.abs(parsed) > levelCapConfig.int4Max) {
                return `${beltLabel} ${LEVEL_CAP_EDIT.TEXT.LEVEL_PREFIX}${row.level} ${field.label}${LEVEL_CAP_EDIT.TEXT.ERROR_INT_RANGE}`;
              }
            }
            if (field.valueType === "nullableInt" && value !== "") {
              if (parsed === null) {
                return `${beltLabel} ${LEVEL_CAP_EDIT.TEXT.LEVEL_PREFIX}${row.level} ${field.label}${LEVEL_CAP_EDIT.TEXT.ERROR_NULLABLE_INT}`;
              }
              if (Math.abs(parsed) > levelCapConfig.int4Max) {
                return `${beltLabel} ${LEVEL_CAP_EDIT.TEXT.LEVEL_PREFIX}${row.level} ${field.label}${LEVEL_CAP_EDIT.TEXT.ERROR_INT_RANGE}`;
              }
            }
          }
        }
      }
    }
    return null;
  };

  const handleSave = async () => {
    clearError();
    setIsSaved(false);
    const validationError = validate();
    if (validationError) {
      handleError(new Error(validationError));
      return;
    }
    setIsSaving(true);
    try {
      const allRows = [
        ...(rowsByBelt[LEVEL_CAP_EDIT.VALUE.BELT_B] ?? []),
        ...(rowsByBelt[LEVEL_CAP_EDIT.VALUE.BELT_C] ?? []),
      ];
      await updateLevelCaps(levelCapConfig.toBody(allRows));
      setIsSaved(true);
    } catch (err) {
      handleError(err);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSectionTable = (beltKey: string, rows: LevelCapFormRowType[], section: LevelCapSectionType) => (
    <Box key={section.title} minWidth="0">
      <Text fontWeight="bold" fontSize="md" mb={2}>{section.title}</Text>
      <Box width="100%" minWidth="0" borderWidth="1px" borderRadius="md" overflowX="auto">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader whiteSpace="nowrap">{LEVEL_CAP_EDIT.TEXT.LEVEL_PREFIX}</Table.ColumnHeader>
              {section.fields.map((field) => (
                <Table.ColumnHeader key={field.column} whiteSpace="nowrap">
                  {field.label}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={`${beltKey}-${row.id}`}>
                <Table.Cell whiteSpace="nowrap" fontWeight="bold">{row.level}</Table.Cell>
                {section.fields.map((field) => (
                  <Table.Cell key={field.column} minW={field.valueType === "text" ? "9rem" : "7rem"}>
                    <Input
                      size="sm"
                      value={row.values[field.column] ?? ""}
                      onChange={(e) => handleChange(beltKey, row.id, field.column, e.target.value)}
                    />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      {section.footnote && (
        <Text fontSize="xs" color="gray.500" mt={1}>{section.footnote}</Text>
      )}
    </Box>
  );

  return (
    <AdminLayoutTemplate title={LEVEL_CAP_EDIT.TEXT.TITLE}>
      <Heading size="md" mb={4}>{LEVEL_CAP_EDIT.TEXT.TITLE}</Heading>
      <Box bg="white" borderRadius="md" shadow="sm" p={6}>
        {error && (
          <Alert.Root status="error" mb={4}>
            <Alert.Indicator />
            <Alert.Description>{error}</Alert.Description>
          </Alert.Root>
        )}
        {isSaved && (
          <Alert.Root status="success" mb={4}>
            <Alert.Indicator />
            <Alert.Description>{LEVEL_CAP_EDIT.TEXT.SAVED}</Alert.Description>
          </Alert.Root>
        )}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Tabs.Root value={belt} onValueChange={(details) => setBelt(details.value)} mb={4}>
              <Tabs.List>
                <Tabs.Trigger value={LEVEL_CAP_EDIT.VALUE.BELT_B} cursor="pointer">
                  {LEVEL_CAP_EDIT.TEXT.TAB_B}
                </Tabs.Trigger>
                <Tabs.Trigger value={LEVEL_CAP_EDIT.VALUE.BELT_C} cursor="pointer">
                  {LEVEL_CAP_EDIT.TEXT.TAB_C}
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
            <VStack gap={8} align="stretch">
              {levelCapConfig.formSections.map((section) => renderSectionTable(belt, rowsByBelt[belt] ?? [], section))}
            </VStack>
            <Separator mt={8} mb={4} />
            <HStack justify="flex-end">
              <Button colorPalette="blue" onClick={handleSave} loading={isSaving}>
                {LEVEL_CAP_EDIT.TEXT.SAVE}
              </Button>
            </HStack>
          </>
        )}
      </Box>
    </AdminLayoutTemplate>
  );
}
