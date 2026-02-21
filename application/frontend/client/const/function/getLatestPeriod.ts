import Papa from "papaparse";

export const getLatestPeriod = async (): Promise<string> => {
  const response = await fetch("/csv/regulation-item.csv");
  const csvText = await response.text();
  const result = Papa.parse<{ id: string }>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  const ids = result.data.map((row) => Number(row.id)).filter((id) => !isNaN(id));
  const maxId = Math.max(...ids);
  return String(maxId);
};
