"use client";
import { Field, Textarea } from "@chakra-ui/react";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  rows?: number;
};

export default function TextareaField({ label, value, onChange, required, placeholder, helperText, rows }: Props) {
  return (
    <Field.Root required={required}>
      <Field.Label color={STYLE_COLOR.PRIMARY} fontWeight="bold" mb={1}>
        {label}
        {required && <Field.RequiredIndicator />}
      </Field.Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows ?? 8}
        bg={STYLE_COLOR.WHITE}
        borderWidth="1px"
        borderColor={STYLE_COLOR.BORDER}
        borderRadius="lg"
        boxShadow="sm"
        color={STYLE_COLOR.BLACK}
        px={4}
        py={3}
        _hover={{ borderColor: STYLE_COLOR.SECONDARY }}
        _focus={{ borderColor: STYLE_COLOR.SECONDARY, boxShadow: `0 0 0 1px ${STYLE_COLOR.SECONDARY}`, outline: "none" }}
      />
      {helperText && <Field.HelperText fontSize="xs">{helperText}</Field.HelperText>}
    </Field.Root>
  );
}
