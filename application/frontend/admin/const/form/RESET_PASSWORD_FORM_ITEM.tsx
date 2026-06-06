import type { FormItemType } from "@/const/type/form/FormItemType";

export const RESET_PASSWORD_FORM_ITEM: { [key: string]: FormItemType } = {
  USER_ID: {
    column: "userId",
    label: "ユーザーID",
    type: "text",
    rule: { required: true },
  },
  PASSWORD: {
    column: "password",
    label: "新しいパスワード",
    type: "password",
    rule: { required: true, minLength: 8 },
  },
  PASSWORD_CONFIRM: {
    column: "passwordConfirm",
    label: "新しいパスワード（確認）",
    type: "password",
    rule: { required: true },
  },
} as const;
