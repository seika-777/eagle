export const LOGIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string | number };
} = {
  TEXT: {
    TITLE: "ログイン",
    USER_ID_LABEL: "ユーザーID",
    PASSWORD_LABEL: "パスワード",
    SUBMIT: "ログイン",
    ERROR_INVALID: "ユーザーIDまたはパスワードが正しくありません",
    ERROR_NO_PERMISSION: "このアカウントではマイページを利用できません",
  },
  VALUE: {
    PASSWORD_MIN_LENGTH: 8,
  },
} as const;
