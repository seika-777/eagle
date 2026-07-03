"use client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import Header from "@/component/molecules/Header";
import EmotionCacheProvider from "@/app/EmotionCacheProvider";

type Props = {
  children: ReactNode;
  siteName: string;
};

export default function AppWrapper({ children, siteName }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <EmotionCacheProvider>
      <ChakraProvider value={defaultSystem}>
        {isMounted && <Header siteName={siteName} />}
        {children}
      </ChakraProvider>
    </EmotionCacheProvider>
  );
}
