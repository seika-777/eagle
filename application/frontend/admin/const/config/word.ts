import type { EntityConfigType } from "@/const/type/config/EntityConfigType";

export const wordConfig: EntityConfigType = {
  apiType: "word",
  listTitle: "語録管理",
  addLabel: "語録を追加",
  editTitle: "語録を編集",
  deleteConfirm: "この語録を削除しますか？",
  initialForm: {
    title: "",
    description: "",
  },
  columns: [
    { key: "id", label: "ID" },
    { key: "title", label: "タイトル" },
  ],
  formItems: [
    { column: "title", label: "タイトル", type: "text", rule: { required: true } },
    { column: "description", label: "内容", type: "rich-text" },
  ],
  toForm: (data) => ({
    title: data.title,
    description: data.description ?? "",
  }),
  toBody: (form) => form,
};
