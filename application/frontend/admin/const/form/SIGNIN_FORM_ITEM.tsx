import type { FormItemType } from "@/const/type/form/FormItemType";

export const SIGNIN_FORM_ITEM: { [key: string]: FormItemType } = {
  SIGNUP_CODE: {
    column: "signupCode",
    label: "登録コード",
    type: "password",
    rule: { required: true },
  },
  USER_ID: {
    column: "userId",
    label: "ユーザーID",
    type: "text",
    rule: { required: true, pattern: "^[a-zA-Z0-9_]+$" },
  },
  DISPLAY_NAME: {
    column: "displayName",
    label: "ユーザー名",
    type: "text",
    rule: { required: true },
  },
  PASSWORD: {
    column: "password",
    label: "パスワード",
    type: "password",
    rule: { required: true, minLength: 8 },
  },
  PASSWORD_CONFIRM: {
    column: "passwordConfirm",
    label: "パスワード（確認）",
    type: "password",
    rule: { required: true },
  },
} as const;
