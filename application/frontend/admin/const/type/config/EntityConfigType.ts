import type { TableColumnType, TableRow } from "@/const/type/table/TableColumnType";
import type { FormItemType } from "@/const/type/form/FormItemType";

export type FormRecord = Record<string, string | number | boolean | string[] | number[] | (string | number)[] | null>;

export type EntityConfigType = {
  apiType: string;
  listTitle: string;
  addLabel: string;
  editTitle: string;
  deleteConfirm: string;
  columns: TableColumnType[];
  spColumns?: TableColumnType[];
  formItems: FormItemType[];
  initialForm: FormRecord;
  toForm: (data: TableRow) => FormRecord;
  toBody: (form: FormRecord) => FormRecord;
};
