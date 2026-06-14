export const MYPAGE: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string | number };
} = {
  TEXT: {
    TITLE: "マイページ",
    SUBTITLE: "キャラクターの登録状況と、最新レギュレーションでの成長指示を確認できます。",
    LATEST_BADGE: "最新",
    URL_HELP: "ゆとシートのキャラクターシート URL をそのまま貼り付けてください。",
    NOTE_HELP: "メモや補足があれば入力してください（任意）。",
    URL_LABEL: "ゆとシートURL",
    CHARACTER_LABEL: "キャラクター",
    CHARACTOR_ROLE_LABEL: "役割",
    SAVE: "保存",
    SAVED: "保存しました",
    EDIT: "編集",
    CANCEL: "キャンセル",
    UNREGISTERED: "未登録",
    INVALID_URL: "ゆとシートURLが正しくありません",
    GUIDE_LABEL: "成長指示",
    CURRENT_LEVEL: "現在のレベル帯",
    GUIDE_DESC: "成長鯖より下記の成長をしてください。",
    GUIDE_EXP: "経験点",
    GUIDE_GROWTH: "成長",
    GUIDE_REWARD: "報酬金額",
    GUIDE_HONOR: "名誉点",
    GUIDE_NONE: "現在、成長指示はありません",
    NO_LATEST: "対象のレギュレーションがありません",
    NO_URL: "ゆとシートURLが未登録です。「ゆとシート設定」から登録してください",
  },
  VALUE: {
    URL_PLACEHOLDER: "https://yutorize.2-d.jp/ytsheet/sw2.5/?id=XXXXXX",
    NOTE_PLACEHOLDER: "（任意）",
    UNIT_EXP: "点",
    UNIT_GROWTH: "回",
    UNIT_REWARD: "G",
    UNIT_HONOR: "点",
    // JSONP 取得用のコールバッククエリ。コールバック名はサーバー固定の安全な定数（英数字のみ）。
    // ユーザー入力は一切使わない（コールバック名インジェクション防止）。サーバー側で付与する。
    YUTOSHEET_JSONP_QUERY: "&callback=ytsheetJsonp",
  },
} as const;
