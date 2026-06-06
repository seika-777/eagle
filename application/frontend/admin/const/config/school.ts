import type { EntityConfigType } from "@/const/type/config/EntityConfigType";

export const schoolConfig: EntityConfigType = {
  apiType: "school",
  listTitle: "流派管理",
  addLabel: "流派を追加",
  editTitle: "流派を編集",
  deleteConfirm: "この流派を削除しますか？",
  initialForm: { name: "", url: "", isAlways: false, notes: "" },
  columns: [
    { key: "id", label: "ID" },
    { key: "name", label: "名前" },
    { key: "url", label: "オリジナル", render: (v) => (v ? "○" : "—") },
    { key: "is_always", label: "常時", render: (v) => (v ? "○" : "—") },
  ],
  spColumns: [
    { key: "id", label: "ID" },
    { key: "name", label: "名前" },
  ],
  formItems: [
    { column: "name", label: "名前", type: "text", rule: { required: true } },
    { column: "url", label: "URL", type: "text" },
    { column: "isAlways", label: "常時使用可能", type: "checkbox" },
    { column: "notes", label: "備考", type: "textarea" },
  ],
  toForm: (data) => ({
    name: data.name,
    url: data.url,
    isAlways: data.is_always,
    notes: data.notes,
  }),
  toBody: (form) => form,
};
