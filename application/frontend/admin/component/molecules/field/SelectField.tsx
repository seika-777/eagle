"use client";
import { Field, NativeSelect } from "@chakra-ui/react";

type Props = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: readonly { label: string; value: string | number }[];
  required?: boolean;
  placeholder?: string;
};

export default function SelectField({ label, value, onChange, options, required, placeholder }: Props) {
  return (
    <Field.Root required={required}>
      <Field.Label>
        {label}
        {required && <Field.RequiredIndicator />}
      </Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Field
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Field.Root>
  );
}
