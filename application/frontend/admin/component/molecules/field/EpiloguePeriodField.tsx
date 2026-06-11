"use client";
import { Stack, Box, Text } from "@chakra-ui/react";
import DateInputField from "@/component/molecules/field/DateInputField";

type Props = {
  startDate: string;
  endDate: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
};

export default function EpiloguePeriodField({ startDate, endDate, onStartChange, onEndChange }: Props) {
  return (
    <Box>
      <Text fontWeight="medium" mb={2}>エピローグ期間</Text>
      <Stack direction={{ base: "column", md: "row" }} gap={3} align={{ base: "stretch", md: "center" }} width="fit-content">
        <DateInputField label="開始日" value={startDate} onChange={onStartChange} />
        <DateInputField label="終了日" value={endDate} onChange={onEndChange} />
      </Stack>
    </Box>
  );
}
