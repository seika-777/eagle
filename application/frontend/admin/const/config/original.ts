import type { EntityConfigType } from "@/const/type/config/EntityConfigType";

export const originalConfig: EntityConfigType = {
  apiType: "original",
  listTitle: "オリジナルアイテム管理",
  addLabel: "オリジナルアイテムを追加",
  editTitle: "オリジナルアイテムを編集",
  deleteConfirm: "このオリジナルアイテムを削除しますか？",
  initialForm: { type: "", name: "", url: "" },
  columns: [
    { key: "id", label: "ID" },
    { key: "type", label: "種別" },
    { key: "name", label: "アイテム名" },
  ],
  spColumns: [
    { key: "id", label: "ID" },
    { key: "name", label: "アイテム名" },
  ],
  formItems: [
    { column: "type", label: "種別", type: "text", rule: { required: true } },
    { column: "name", label: "アイテム名", type: "text", rule: { required: true } },
    { column: "url", label: "URL", type: "text" },
  ],
  toForm: (data) => ({ type: data.type, name: data.name, url: data.url }),
  toBody: (form) => form,
};
