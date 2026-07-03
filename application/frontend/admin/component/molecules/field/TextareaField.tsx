"use client";
import { Field, Textarea } from "@chakra-ui/react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
};

export default function TextareaField({ label, value, onChange, required, placeholder, rows = 8 }: Props) {
  return (
    <Field.Root required={required}>
      <Field.Label>
        {label}
        {required && <Field.RequiredIndicator />}
      </Field.Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </Field.Root>
  );
}
