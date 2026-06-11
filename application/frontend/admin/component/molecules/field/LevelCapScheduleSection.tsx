"use client";
import { useEffect, useRef, useState } from "react";
import { Box, VStack, Text, HStack, Input, Field, Button } from "@chakra-ui/react";
import DateInputField from "@/component/molecules/field/DateInputField";
import SelectRadioField from "@/component/molecules/field/SelectRadioField";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { LevelCapScheduleItem } from "@/const/type/config/EntityConfigType";

type Props = {
  label: string;
  belt: string;
  values: LevelCapScheduleItem[];
  onChange: (values: LevelCapScheduleItem[]) => void;
  epilogueStartDate?: string;
};

export default function LevelCapScheduleSection({ label, belt, values, onChange, epilogueStartDate }: Props) {
  const [rows, setRows] = useState<LevelCapScheduleItem[]>([]);
  const [isManual, setIsManual] = useState(false);
  const [interval, setInterval] = useState(15);
  const { handleError } = useErrorHandler();
  const isFirstMountRef = useRef(true);
  const valuesRef = useRef<LevelCapScheduleItem[]>(values);

  useEffect(() => {
    valuesRef.current = values;
    const hasSavedDates = values.some((v) => v.date);
    if (hasSavedDates) setIsManual(true);
  }, [values]);

  // ベルト変更時: レベル一覧を取得し、保存済みデータがあればマージ
  useEffect(() => {
    const fetchAndBuild = async () => {
      try {
        const res = await fetch(`/api/level-cap?belt=${belt}`);
        const levels: { id: number; level: string }[] = await res.json();
        const saved = valuesRef.current;
        const merged = levels.map((lv) => {
          const s = saved.find((v) => v.levelCapId === lv.id);
          return { levelCapId: lv.id, level: lv.level, date: s?.date ?? "" };
        });
        setRows(merged);
        if (!isFirstMountRef.current) {
          onChange(merged);
        }
        isFirstMountRef.current = false;
      } catch (err) {
        handleError(err);
      }
    };
    fetchAndBuild();
  }, [belt]);

  // 親が非同期でDB値をロードした後（ベルトfetch完了後）にマージ
  useEffect(() => {
    if (values.length === 0) return;
    setRows((prev) => {
      if (prev.length === 0) return prev;
      const needsUpdate = values.some((v) => {
        const row = prev.find((r) => r.levelCapId === v.levelCapId);
        return row && v.date && row.date !== v.date;
      });
      if (!needsUpdate) return prev;
      return prev.map((row) => {
        const saved = values.find((v) => v.levelCapId === row.levelCapId);
        return saved?.date ? { ...row, date: saved.date } : row;
      });
    });
  }, [values]);

  const handleDateChange = (levelCapId: number, date: string) => {
    const updatedRows = rows.map((row) =>
      row.levelCapId === levelCapId ? { ...row, date } : row
    );

    const firstRow = updatedRows[0];
    if (firstRow.levelCapId === levelCapId && date) {
      const addDays = (dateStr: string, days: number): string => {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + days);
        return d.toISOString().slice(0, 10);
      };
      const autoFilled = updatedRows.map((row, index) =>
        index === 0 || row.date ? row : { ...row, date: addDays(date, index * interval) }
      );
      setRows(autoFilled);
      onChange(autoFilled);
      return;
    }

    setRows(updatedRows);
    onChange(updatedRows);
  };

  const lastDate = rows.length > 0 ? rows[rows.length - 1].date : "";
  const levelCapEndDate = (() => {
    if (epilogueStartDate) {
      const d = new Date(epilogueStartDate);
      d.setDate(d.getDate() - 1);
      return d.toISOString().slice(0, 10);
    }
    if (!lastDate) return "";
    const d = new Date(lastDate);
    d.setDate(d.getDate() + interval);
    return d.toISOString().slice(0, 10);
  })();

  return (
    <Box>
      {rows[0] && (
        <Box>
          <DateInputField
            label="レベルキャップ開始日"
            value={rows[0].date}
            onChange={(value) => handleDateChange(rows[0].levelCapId, value)}
          />
          {levelCapEndDate && (
            <Text fontSize="sm" color="fg.muted" mt={1}>
              レベルキャップ終了日: {levelCapEndDate}
            </Text>
          )}
          <HStack mt={2} align="center">
            <Text fontSize="sm" whiteSpace="nowrap">手動変更</Text>
            <SelectRadioField
              options={[
                { label: "する", value: "manual" },
                { label: "しない", value: "auto" },
              ]}
              value={isManual ? "manual" : "auto"}
              onChange={(v) => setIsManual(v === "manual")}
            />
            <HStack align="center" gap={1}>
              <Text fontSize="sm" whiteSpace="nowrap">間隔</Text>
              <Input
                type="number"
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                min={1}
                w="60px"
                size="sm"
              />
              <Text fontSize="sm" color="fg.muted">日</Text>
            </HStack>
          </HStack>
        </Box>
      )}
      {isManual && rows.length > 0 && (
        <VStack gap={3} pt={3} align="stretch">
          <Button
            size="sm"
            variant="outline"
            colorPalette="red"
            alignSelf="flex-start"
            disabled={rows.every((r) => !r.date)}
            onClick={() => {
              const startDate = rows[0]?.date;
              if (!startDate) return;
              const addDays = (dateStr: string, days: number): string => {
                const d = new Date(dateStr);
                d.setDate(d.getDate() + days);
                return d.toISOString().slice(0, 10);
              };
              const recalculated = rows.map((row, index) => ({
                ...row,
                date: addDays(startDate, index * interval),
              }));
              setRows(recalculated);
              onChange(recalculated);
            }}
          >
            リセット
          </Button>
          {rows.map((row) => (
            <DateInputField
              key={row.levelCapId}
              label={`Lv. ${row.level}`}
              value={row.date}
              onChange={(value) => handleDateChange(row.levelCapId, value)}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
}
