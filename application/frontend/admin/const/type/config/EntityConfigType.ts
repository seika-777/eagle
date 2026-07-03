import type { TableColumnType, TableRow } from "@/const/type/table/TableColumnType";
import type { FormItemType } from "@/const/type/form/FormItemType";
import type { GuideItemType } from "@/const/type/option/GuideItemType";

export type LevelCapScheduleItem = {
  levelCapId: number;
  level: string;
  date: string;
};

export type FormRecord = Record<
  string,
  | string
  | number
  | boolean
  | string[]
  | number[]
  | (string | number)[]
  | Record<string, string | number | boolean | null>
  | Record<string, string | number | boolean | null>[]
  | LevelCapScheduleItem[]
  | GuideItemType[]
  | null
>;

export type EntityConfigType = {
  apiType: string;
  listTitle: string;
  addLabel: string;
  editTitle: string;
  deleteConfirm: string;
  hideAdd?: boolean;
  hideDelete?: boolean;
  showAuthDelete?: boolean;
  inlineCellChange?: boolean;
  columns: TableColumnType[];
  spColumns?: TableColumnType[];
  formItems: FormItemType[];
  initialForm: FormRecord;
  toForm: (data: TableRow) => FormRecord;
  toBody: (form: FormRecord) => FormRecord;
  previewBasePath?: string;
};
