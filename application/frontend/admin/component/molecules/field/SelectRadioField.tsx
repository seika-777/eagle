"use client";
import { HStack, Button } from "@chakra-ui/react";

type Option = { label: string; value: string };

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export default function SelectRadioField({ options, value, onChange }: Props) {
  return (
    <HStack gap={0}>
      {options.map((opt, index) => (
        <Button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          colorPalette="blue"
          variant={value === opt.value ? "solid" : "outline"}
          borderRadius={0}
          borderLeftRadius={index === 0 ? "md" : 0}
          borderRightRadius={index === options.length - 1 ? "md" : 0}
          size="sm"
        >
          {opt.label}
        </Button>
      ))}
    </HStack>
  );
}
