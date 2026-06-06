export const LOGIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string | number };
} = {
  TEXT: {
    TITLE: "管理者ログイン",
    SUBMIT: "ログイン",
    LINK_SIGNIN: "アカウントをお持ちでない方はこちら",
    LINK_RESET: "パスワードをリセットする",
    ERROR_INVALID: "ユーザーIDまたはパスワードが正しくありません",
  },
  VALUE: {
    PASSWORD_MIN_LENGTH: 8,
  },
} as const;
