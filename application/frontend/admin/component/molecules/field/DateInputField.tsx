"use client";
import { HStack, Field } from "@chakra-ui/react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export default function DateInputField({ label, value, onChange, required }: Props) {
  return (
    <Field.Root required={required}>
      <HStack align="center" gap={3}>
        <Field.Label whiteSpace="nowrap" mb={0}>
          {label}
          {required && <Field.RequiredIndicator />}
        </Field.Label>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </HStack>
    </Field.Root>
  );
}
