export const RESET_PASSWORD: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string | number };
} = {
  TEXT: {
    TITLE: "パスワードリセット",
    SUBMIT: "パスワードをリセット",
    LINK_LOGIN: "ログインに戻る",
    ERROR_PASSWORD_MISMATCH: "パスワードが一致しません",
    ERROR_DEFAULT: "リセットに失敗しました。もう一度お試しください",
  },
  VALUE: {
    PASSWORD_MIN_LENGTH: 8,
  },
} as const;
