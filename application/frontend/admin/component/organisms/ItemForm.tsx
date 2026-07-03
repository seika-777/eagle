"use client";
import { VStack, Box, Text, Separator } from "@chakra-ui/react";
import TextInputField from "@/component/molecules/field/TextInputField";
import TextareaField from "@/component/molecules/field/TextareaField";
import RichTextField from "@/component/molecules/field/RichTextField";
import SelectField from "@/component/molecules/field/SelectField";
import CheckboxField from "@/component/molecules/field/CheckboxField";
import CheckboxGroupField from "@/component/molecules/field/CheckboxGroupField";
import DateInputField from "@/component/molecules/field/DateInputField";
import LevelCapScheduleSection from "@/component/molecules/field/LevelCapScheduleSection";
import GuideListSection from "@/component/molecules/field/GuideListSection";
import EpiloguePeriodField from "@/component/molecules/field/EpiloguePeriodField";
import type { FormItemType } from "@/const/type/form/FormItemType";
import type { FormRecord, LevelCapScheduleItem } from "@/const/type/config/EntityConfigType";
import type { GuideItemType } from "@/const/type/option/GuideItemType";

type Props = {
  formItems: FormItemType[];
  form: FormRecord;
  onChange: (key: string, value: FormRecord[string]) => void;
  dynamicOptions?: Record<string, readonly { label: string; value: string | number }[]>;
};

export default function ItemForm({ formItems, form, onChange, dynamicOptions }: Props) {
  return (
    <VStack gap={4} align="stretch">
      {formItems.map((item) => {
        const value = form[item.column];
        const options = item.option ?? dynamicOptions?.[item.column] ?? [];

        if (item.type === "text" || item.type === "password") {
          return (
            <TextInputField
              key={item.column}
              label={item.label}
              value={String(value ?? "")}
              onChange={(v) => onChange(item.column, v)}
              type={item.type}
              required={item.rule?.required}
            />
          );
        }
        if (item.type === "textarea") {
          return (
            <TextareaField
              key={item.column}
              label={item.label}
              value={String(value ?? "")}
              onChange={(v) => onChange(item.column, v)}
              required={item.rule?.required}
              rows={item.rows}
            />
          );
        }
        if (item.type === "rich-text") {
          return (
            <RichTextField
              key={item.column}
              label={item.label}
              value={String(value ?? "")}
              onChange={(v) => onChange(item.column, v)}
              required={item.rule?.required}
            />
          );
        }
        if (item.type === "select") {
          return (
            <SelectField
              key={item.column}
              label={item.label}
              value={(value as string | number) ?? ""}
              onChange={(v) => onChange(item.column, v)}
              options={options}
              required={item.rule?.required}
              placeholder={item.placeholder}
            />
          );
        }
        if (item.type === "checkbox") {
          return (
            <CheckboxField
              key={item.column}
              label={item.label}
              checked={Boolean(value)}
              onChange={(v) => onChange(item.column, v)}
            />
          );
        }
        if (item.type === "checkbox-group") {
          return (
            <CheckboxGroupField
              key={item.column}
              label={item.label}
              values={Array.isArray(value) ? (value as (string | number)[]) : []}
              onChange={(v) => onChange(item.column, v)}
              options={options}
            />
          );
        }
        if (item.type === "date") {
          return (
            <DateInputField
              key={item.column}
              label={item.label}
              value={String(form[item.column] ?? "")}
              onChange={(v) => onChange(item.column, v)}
              required={item.rule?.required}
            />
          );
        }

        if (item.type === "level-cap-schedule") {
          return (
            <LevelCapScheduleSection
              key={item.column}
              label={item.label}
              belt={String(form["levelCapBelt"] ?? "B")}
              values={(form[item.column] as LevelCapScheduleItem[]) ?? []}
              onChange={(v) => onChange(item.column, v)}
              epilogueStartDate={String(form["epilogueStartDate"] ?? "")}
            />
          );
        }

        if (item.type === "guide-list") {
          return (
            <GuideListSection
              key={item.column}
              label={item.label}
              values={(form[item.column] as GuideItemType[]) ?? []}
              onChange={(v) => onChange(item.column, v)}
            />
          );
        }

        if (item.type === "epilogue-period") {
          return (
            <EpiloguePeriodField
              key={item.column}
              startDate={String(form["epilogueStartDate"] ?? "")}
              endDate={String(form["epilogueEndDate"] ?? "")}
              onStartChange={(v) => onChange("epilogueStartDate", v)}
              onEndChange={(v) => onChange("epilogueEndDate", v)}
            />
          );
        }

        if (item.type === "section-heading") {
          return (
            <Box key={item.column} pt={4} pb={1}>
              <Separator />
              <Text fontWeight="bold" mt={3} fontSize="sm" color="gray.600">
                {item.label}
              </Text>
            </Box>
          );
        }

        return null;
      })}
    </VStack>
  );
}
