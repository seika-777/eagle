"use client";
import { Box, Checkbox, Text } from "@chakra-ui/react";

type Props = {
  label: string;
  values: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  options: readonly { label: string; value: string | number }[];
};

export default function CheckboxGroupField({ label, values, onChange, options }: Props) {
  const handleChange = (optValue: string | number, checked: boolean) => {
    if (checked) {
      onChange([...values, optValue]);
    } else {
      onChange(values.filter((v) => v !== optValue));
    }
  };

  return (
    <Box>
      <Text fontWeight="medium" mb={2}>{label}</Text>
      <Box display="flex" flexWrap="wrap" gap={3}>
        {options.map((opt) => (
          <Checkbox.Root
            key={opt.value}
            checked={values.includes(opt.value)}
            onCheckedChange={(e) => handleChange(opt.value, !!e.checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{opt.label}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Box>
    </Box>
  );
}
