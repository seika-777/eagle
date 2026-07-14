import type { LevelCapRowType } from "@/const/type/levelCap/LevelCapRowType";
import type { LevelCapFormRowType } from "@/const/type/levelCap/LevelCapFormRowType";
import type { LevelCapUpdateItemType } from "@/const/type/levelCap/LevelCapUpdateItemType";

export type LevelCapFieldValueType = "requiredInt" | "nullableInt" | "text";

export type LevelCapFieldType = {
  column: string;
  label: string;
  valueType: LevelCapFieldValueType;
};

export type LevelCapSectionType = {
  title: string;
  fields: LevelCapFieldType[];
  footnote?: string;
};

export type LevelCapConfigType = {
  formSections: LevelCapSectionType[];
  int4Max: number;
  parseInteger: (text: string) => number | null;
  toForm: (rows: LevelCapRowType[]) => LevelCapFormRowType[];
  toBody: (rows: LevelCapFormRowType[]) => { items: LevelCapUpdateItemType[] };
};
