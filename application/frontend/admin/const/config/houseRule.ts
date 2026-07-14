import type { EntityConfigType } from "@/const/type/config/EntityConfigType";
import { RULE } from "@/const/common/RULE";

export const houseRuleConfig: EntityConfigType = {
  apiType: "house-rule",
  listTitle: "ハウスルール管理",
  addLabel: "ハウスルールを追加",
  editTitle: "ハウスルールを編集",
  deleteConfirm: "このハウスルールを削除しますか？",
  initialForm: { isProhibition: "false", ruleType: "common", supplementId: null, about: "", description: "" },
  sortable: true,
  columns: [
    { key: "id", label: "ID" },
    {
      key: "rule_type",
      label: "ルール種別",
      render: (v) => RULE.TEXT[v as keyof typeof RULE.TEXT] ?? String(v),
    },
    {
      key: "supplement_items",
      label: "サプリメント",
      render: (v) => {
        if (v && typeof v === "object" && "name" in (v as object)) {
          return (v as { name: string }).name;
        }
        return "—";
      },
    },
    { key: "about", label: "概要" },
  ],
  spColumns: [
    { key: "id", label: "ID" },
    { key: "about", label: "概要" },
  ],
  formItems: [
    {
      column: "isProhibition",
      label: "区分",
      type: "radio",
      rule: { required: true },
      option: [
        { label: "ハウスルール", value: "false" },
        { label: "禁止事項", value: "true" },
      ],
    },
    {
      column: "ruleType",
      label: "ルール種別",
      type: "select",
      rule: { required: true },
      option: RULE.TYPE_ORDER.map((v) => ({ label: RULE.TEXT[v], value: v })),
    },
    {
      column: "supplementId",
      label: "サプリメント",
      type: "select",
      // option は dynamicOptions["supplementId"] から動的提供
    },
    { column: "about", label: "概要", type: "text", rule: { required: true } },
    { column: "description", label: "詳細説明", type: "textarea", rule: { required: true } },
  ],
  toForm: (data) => ({
    isProhibition: data.is_prohibition === true ? "true" : "false",
    ruleType: data.rule_type,
    supplementId: data.supplement_id ?? null,
    about: data.about,
    description: data.description,
  }),
  toBody: (form) => ({
    isProhibition: form.isProhibition === "true",
    ruleType: form.ruleType,
    supplementId: form.supplementId === "" ? null : form.supplementId,
    about: form.about,
    description: form.description,
  }),
};
