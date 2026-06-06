"use client";
import { VStack } from "@chakra-ui/react";
import TextInputField from "@/component/molecules/field/TextInputField";
import TextareaField from "@/component/molecules/field/TextareaField";
import RichTextField from "@/component/molecules/field/RichTextField";
import SelectField from "@/component/molecules/field/SelectField";
import CheckboxField from "@/component/molecules/field/CheckboxField";
import CheckboxGroupField from "@/component/molecules/field/CheckboxGroupField";
import type { FormItemType } from "@/const/type/form/FormItemType";
import type { FormRecord } from "@/const/type/config/EntityConfigType";

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
        return null;
      })}
    </VStack>
  );
}
