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

const CATEGORY_OPTIONS = [
  { label: "舞台", value: "stage" },
  { label: "NPC", value: "npc" },
] as const;

const CATEGORY_LABEL: Record<string, string> = {
  stage: "舞台",
  npc: "NPC",
};

export const stageTermConfig: EntityConfigType = {
  apiType: "stage-term",
  listTitle: "舞台/用語管理",
  addLabel: "舞台/用語を追加",
  editTitle: "舞台/用語を編集",
  deleteConfirm: "この舞台/用語を削除しますか？",
  initialForm: {
    title: "",
    category: "",
    continent: "",
    description: "",
    regulationIds: [],
  },
  columns: [
    { key: "title", label: "タイトル" },
    {
      key: "category",
      label: "種別",
      render: (v) => CATEGORY_LABEL[String(v)] ?? String(v ?? ""),
    },
    {
      key: "continent",
      label: "大陸",
      render: (v) => CONTINENT_LABEL[String(v)] ?? String(v ?? ""),
    },
  ],
  spColumns: [
    { key: "title", label: "タイトル" },
    {
      key: "category",
      label: "種別",
      render: (v) => CATEGORY_LABEL[String(v)] ?? String(v ?? ""),
    },
  ],
  formItems: [
    { column: "title", label: "タイトル", type: "text", rule: { required: true } },
    { column: "category", label: "種別", type: "select", rule: { required: true }, option: CATEGORY_OPTIONS, placeholder: "選択してください" },
    { column: "continent", label: "大陸", type: "select", rule: { required: true }, option: CONTINENT_OPTIONS, placeholder: "選択してください" },
    { column: "description", label: "内容", type: "rich-text" },
    { column: "regulationIds", label: "レギュレーション", type: "checkbox-group" },
  ],
  toForm: (data) => ({
    title: data.title,
    category: data.category ?? "",
    continent: data.continent ?? "",
    description: data.description ?? "",
    regulationIds: data.regulationIds ?? [],
  }),
  toBody: (form) => form,
};
