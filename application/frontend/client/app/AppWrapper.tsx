"use client";
import { ChakraProvider } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const _NoSSR: React.FC<Props> = ({ children }) => (
  <React.Fragment>{children}</React.Fragment>
);
const NoSSR = dynamic(() => Promise.resolve(_NoSSR), { ssr: false });

export default function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <NoSSR>
      <ChakraProvider>{children}</ChakraProvider>
    </NoSSR>
  );
}
