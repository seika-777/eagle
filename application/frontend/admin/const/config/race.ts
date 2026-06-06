import type { EntityConfigType } from "@/const/type/config/EntityConfigType";
import { RACE } from "@/const/common/RACE";

export const raceConfig: EntityConfigType = {
  apiType: "race",
  listTitle: "種族管理",
  addLabel: "種族を追加",
  editTitle: "種族を編集",
  deleteConfirm: "この種族を削除しますか？",
  initialForm: { name: "", raceType: [], url: "", isAlways: false },
  columns: [
    { key: "id", label: "ID" },
    { key: "name", label: "名前" },
    {
      key: "race_type",
      label: "タイプ",
      render: (v) =>
        Array.isArray(v)
          ? (v as string[]).map((s) => RACE.TEXT[s as keyof typeof RACE.TEXT] ?? s).join(", ")
          : "",
    },
    { key: "url", label: "オリジナル", render: (v) => (v ? "○" : "—") },
    { key: "is_always", label: "常時", render: (v) => (v ? "○" : "—") },
  ],
  spColumns: [
    { key: "id", label: "ID" },
    { key: "name", label: "名前" },
  ],
  formItems: [
    { column: "name", label: "名前", type: "text", rule: { required: true } },
    {
      column: "raceType",
      label: "種族タイプ",
      type: "checkbox-group",
      option: Object.entries(RACE.TEXT).map(([value, label]) => ({ label, value })),
    },
    { column: "url", label: "URL", type: "text" },
    { column: "isAlways", label: "常時使用可能", type: "checkbox" },
  ],
  toForm: (data) => ({
    name: data.name,
    raceType: data.race_type ?? [],
    url: data.url,
    isAlways: data.is_always,
  }),
  toBody: (form) => form,
};
