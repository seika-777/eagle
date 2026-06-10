import type { EntityConfigType } from "@/const/type/config/EntityConfigType";

const CONTINENT_OPTIONS = [
  { label: "アルフレイム", value: "alframe" },
  { label: "ケルディオン", value: "keldeon" },
  { label: "テラスティア", value: "terastier" },
  { label: "レーゼルドーン", value: "reseldawn" },
] as const;

const CONTINENT_LABEL: Record<string, string> = {
  alframe: "アルフレイム",
  keldeon: "ケルディオン",
  terastier: "テラスティア",
  reseldawn: "レーゼルドーン",
};

export const stageTermConfig: EntityConfigType = {
  apiType: "stage-term",
  listTitle: "舞台/用語管理",
  addLabel: "舞台/用語を追加",
  editTitle: "舞台/用語を編集",
  deleteConfirm: "この舞台/用語を削除しますか？",
  initialForm: {
    title: "",
    continent: "",
    description: "",
  },
  columns: [
    { key: "id", label: "ID" },
    { key: "title", label: "タイトル" },
    {
      key: "continent",
      label: "大陸",
      render: (v) => CONTINENT_LABEL[String(v)] ?? String(v ?? ""),
    },
  ],
  formItems: [
    { column: "title", label: "タイトル", type: "text", rule: { required: true } },
    { column: "continent", label: "大陸", type: "select", rule: { required: true }, option: CONTINENT_OPTIONS },
    { column: "description", label: "内容", type: "rich-text" },
  ],
  toForm: (data) => ({
    title: data.title,
    continent: data.continent ?? "",
    description: data.description ?? "",
  }),
  toBody: (form) => form,
};
