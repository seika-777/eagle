"use client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import EmotionCacheProvider from "@/app/EmotionCacheProvider";
import { UserContext } from "@/app/UserContext";
import type { UserMetaType } from "@/const/type/auth/UserMetaType";

export default function AppWrapper({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<UserMetaType | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <EmotionCacheProvider>
      <ChakraProvider value={defaultSystem}>
        <UserContext.Provider value={{ user, setUser }}>
          {isMounted && children}
        </UserContext.Provider>
      </ChakraProvider>
    </EmotionCacheProvider>
  );
}
