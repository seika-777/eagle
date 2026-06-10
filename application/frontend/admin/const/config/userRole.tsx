import type { EntityConfigType } from "@/const/type/config/EntityConfigType";

const ROLE_OPTIONS = [
  { label: "なし", value: "common" },
  { label: "ユーザー", value: "general" },
  { label: "管理者", value: "admin" },
] as const;

const ROLE_LABEL: Record<string, string> = {
  common: "なし",
  general: "ユーザー",
  admin: "管理者",
};

export const userRoleConfig: EntityConfigType = {
  apiType: "user-role",
  listTitle: "ロール管理",
  addLabel: "",
  editTitle: "ロールを編集",
  deleteConfirm: "このユーザーのロール設定を削除しますか？",
  hideAdd: true,
  hideDelete: true,
  showAuthDelete: true,
  initialForm: {
    displayName: "",
    role: "common",
    isEditable: false,
  },
  columns: [
    { key: "display_name", label: "表示名" },
    { key: "role", label: "ロール", render: (v) => ROLE_LABEL[String(v)] ?? String(v ?? "") },
  ],
  formItems: [
    { column: "displayName", label: "表示名", type: "text", rule: { required: true } },
    { column: "role", label: "ロール", type: "select", rule: { required: true }, option: ROLE_OPTIONS },
    { column: "isEditable", label: "編集可能", type: "checkbox" },
  ],
  toForm: (data) => ({
    displayName: data.display_name,
    role: data.role,
    isEditable: data.is_editable ?? false,
  }),
  toBody: (form) => ({
    displayName: form.displayName,
    role: form.role,
    isEditable: form.isEditable,
  }),
};
