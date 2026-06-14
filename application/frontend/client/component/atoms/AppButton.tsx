"use client";
import { Button as ChakraButton } from "@chakra-ui/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "cancel";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

export default function AppButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  loading,
  disabled,
  fullWidth,
}: Props) {
  const colorPalette = variant === "cancel" ? "gray" : "blue";
  const chakraVariant = "solid";

  return (
    <ChakraButton
      type={type}
      onClick={onClick}
      size={size}
      loading={loading}
      disabled={disabled}
      colorPalette={colorPalette}
      variant={chakraVariant}
      borderRadius="lg"
      fontWeight="bold"
      width={fullWidth ? "full" : undefined}
    >
      {children}
    </ChakraButton>
  );
}
