"use client";
import { Field, Input } from "@chakra-ui/react";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "password";
  required?: boolean;
  placeholder?: string;
  helperText?: string;
};

export default function TextInputField({ label, value, onChange, type = "text", required, placeholder, helperText }: Props) {
  return (
    <Field.Root required={required}>
      <Field.Label color={STYLE_COLOR.PRIMARY} fontWeight="bold" mb={1}>
        {label}
        {required && <Field.RequiredIndicator />}
      </Field.Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        size="lg"
        bg={STYLE_COLOR.WHITE}
        borderWidth="1px"
        borderColor={STYLE_COLOR.BORDER}
        borderRadius="lg"
        boxShadow="sm"
        color={STYLE_COLOR.BLACK}
        _hover={{ borderColor: STYLE_COLOR.SECONDARY }}
        _focus={{ borderColor: STYLE_COLOR.SECONDARY, boxShadow: `0 0 0 1px ${STYLE_COLOR.SECONDARY}`, outline: "none" }}
      />
      {helperText && <Field.HelperText fontSize="xs">{helperText}</Field.HelperText>}
    </Field.Root>
  );
}
