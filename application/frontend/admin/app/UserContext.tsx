"use client";
import { createContext, useContext } from "react";
import type { UserContextType } from "@/const/type/auth/UserContextType";

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);
