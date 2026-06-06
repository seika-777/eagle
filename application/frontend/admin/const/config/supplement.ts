import type { EntityConfigType } from "@/const/type/config/EntityConfigType";

export const supplementConfig: EntityConfigType = {
  apiType: "supplement",
  listTitle: "サプリメント管理",
  addLabel: "サプリメントを追加",
  editTitle: "サプリメントを編集",
  deleteConfirm: "このサプリメントを削除しますか？",
  initialForm: { name: "", isAlways: false, notes: "" },
  columns: [
    { key: "id", label: "ID" },
    { key: "name", label: "名前" },
    { key: "is_always", label: "常時", render: (v) => (v ? "○" : "—") },
  ],
  spColumns: [
    { key: "id", label: "ID" },
    { key: "name", label: "名前" },
  ],
  formItems: [
    { column: "name", label: "名前", type: "text", rule: { required: true } },
    { column: "isAlways", label: "常時使用可能", type: "checkbox" },
    { column: "notes", label: "備考", type: "textarea" },
  ],
  toForm: (data) => ({
    name: data.name,
    isAlways: data.is_always,
    notes: data.notes,
  }),
  toBody: (form) => form,
};
