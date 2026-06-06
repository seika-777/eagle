export type FormItemType = {
  column: string;
  label: string;
  type: "text" | "textarea" | "password" | "number" | "checkbox" | "checkbox-group" | "select";
  rule?: {
    required?: boolean;
    minLength?: number;
    pattern?: string;
  };
  option?: readonly { label: string; value: string | number }[];
};
