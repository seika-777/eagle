import type { FormSectionType } from "@/const/type/form/FormSectionType";
import type { FormRecord } from "@/const/type/config/EntityConfigType";

export type BasicInfoConfigType = {
  formSections: FormSectionType[];
  initialForm: FormRecord;
  toForm: (data: Record<string, string>) => FormRecord;
  toBody: (form: FormRecord) => Record<string, string>;
};
