export type FormItemType = {
  column: string;
  label: string;
  type: "text" | "textarea" | "rich-text" | "password" | "number" | "checkbox" | "checkbox-group" | "select" | "radio" | "date" | "level-cap-schedule" | "guide-list" | "epilogue-period" | "section-heading";
  rule?: {
    required?: boolean;
    minLength?: number;
    pattern?: string;
  };
  option?: readonly { label: string; value: string | number }[];
  placeholder?: string;
  rows?: number;
};
