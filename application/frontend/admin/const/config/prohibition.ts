import type { EntityConfigType } from "@/const/type/config/EntityConfigType";

export const prohibitionConfig: EntityConfigType = {
  apiType: "prohibition",
  listTitle: "禁止事項管理",
  addLabel: "禁止事項を追加",
  editTitle: "禁止事項を編集",
  deleteConfirm: "この禁止事項を削除しますか？",
  initialForm: { about: "", name: "" },
  columns: [
    { key: "id", label: "ID" },
    { key: "about", label: "カテゴリ" },
    { key: "name", label: "禁止事項名" },
  ],
  spColumns: [
    { key: "id", label: "ID" },
    { key: "about", label: "カテゴリ" },
  ],
  formItems: [
    { column: "about", label: "カテゴリ", type: "text", rule: { required: true } },
    { column: "name", label: "禁止事項", type: "textarea", rule: { required: true } },
  ],
  toForm: (data) => ({ about: data.about, name: data.name }),
  toBody: (form) => form,
};
