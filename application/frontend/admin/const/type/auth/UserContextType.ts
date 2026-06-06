import type { UserMetaType } from "@/const/type/auth/UserMetaType";
export type UserContextType = {
  user: UserMetaType | null;
  setUser: (user: UserMetaType | null) => void;
};
