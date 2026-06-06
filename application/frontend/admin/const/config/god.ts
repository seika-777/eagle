import type { EntityConfigType } from "@/const/type/config/EntityConfigType";

export const godConfig: EntityConfigType = {
  apiType: "god",
  listTitle: "神格管理",
  addLabel: "神格を追加",
  editTitle: "神格を編集",
  deleteConfirm: "この神格を削除しますか？",
  initialForm: { type: 1, name: "", url: "", isAlways: false },
  columns: [
    { key: "id", label: "ID" },
    { key: "type", label: "タイプ", render: (v) => (v === 1 ? "第一" : v === 2 ? "第二" : "第三") },
    { key: "name", label: "名前" },
    { key: "url", label: "オリジナル", render: (v) => (v ? "○" : "—") },
    { key: "is_always", label: "常時", render: (v) => (v ? "○" : "—") },
  ],
  spColumns: [
    { key: "id", label: "ID" },
    { key: "name", label: "名前" },
  ],
  formItems: [
    {
      column: "type",
      label: "タイプ",
      type: "select",
      rule: { required: true },
      option: [
        { label: "第一", value: 1 },
        { label: "第二", value: 2 },
        { label: "第三", value: 3 },
      ],
    },
    { column: "name", label: "名前", type: "text", rule: { required: true } },
    { column: "url", label: "URL", type: "text" },
    { column: "isAlways", label: "常時使用可能", type: "checkbox" },
  ],
  toForm: (data) => ({
    type: data.type,
    name: data.name,
    url: data.url,
    isAlways: data.is_always,
  }),
  toBody: (form) => form,
};
