export type FormItemType = {
  column: string;
  label: string;
  type: "text" | "textarea" | "rich-text" | "password" | "number" | "checkbox" | "checkbox-group" | "select" | "date" | "level-cap-schedule" | "epilogue-period" | "section-heading";
  rule?: {
    required?: boolean;
    minLength?: number;
    pattern?: string;
  };
  option?: readonly { label: string; value: string | number }[];
  placeholder?: string;
};
