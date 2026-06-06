import type { FormItemType } from "@/const/type/form/FormItemType";

export const LOGIN_FORM_ITEM: { [key: string]: FormItemType } = {
  USER_ID: {
    column: "userId",
    label: "ユーザーID",
    type: "text",
    rule: { required: true },
  },
  PASSWORD: {
    column: "password",
    label: "パスワード",
    type: "password",
    rule: { required: true, minLength: 8 },
  },
} as const;
