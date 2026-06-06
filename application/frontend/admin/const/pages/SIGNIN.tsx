export const SIGNIN: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string | number };
} = {
  TEXT: {
    TITLE: "アカウント登録",
    SUBMIT: "登録する",
    LINK_LOGIN: "すでにアカウントをお持ちの方はこちら",
    USER_ID_HINT: "英数字とアンダースコア（_）のみ使用可能",
    SUCCESS: "登録が完了しました。ログインしてください。",
    ERROR_SIGNUP_CODE: "登録コードが正しくありません",
    ERROR_DUPLICATE: "このユーザーIDはすでに使用されています",
    ERROR_PASSWORD_MISMATCH: "パスワードが一致しません",
    ERROR_DEFAULT: "登録に失敗しました。もう一度お試しください",
  },
  VALUE: {
    PASSWORD_MIN_LENGTH: 8,
    USER_ID_PATTERN: "^[a-zA-Z0-9_]+$",
  },
} as const;
