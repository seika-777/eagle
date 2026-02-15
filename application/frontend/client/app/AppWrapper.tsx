"use client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import React, { ReactNode } from "react";

export default function AppWrapper({ children }: { children: ReactNode }) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
}
