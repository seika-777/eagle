"use client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import Header from "@/component/molecules/Header";
import EmotionCacheProvider from "@/app/EmotionCacheProvider";

export default function AppWrapper({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <EmotionCacheProvider>
      <ChakraProvider value={defaultSystem}>
        {isMounted && <Header />}
        {children}
      </ChakraProvider>
    </EmotionCacheProvider>
  );
}
