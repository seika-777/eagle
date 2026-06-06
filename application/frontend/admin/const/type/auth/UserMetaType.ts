import type { UserRoleType } from "@/const/type/auth/UserRoleType";
export type UserMetaType = {
  id: string;
  userId: string;
  displayName: string;
  role: UserRoleType;
  isEditable: boolean;
  createdAt: string;
};
