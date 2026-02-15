import fs from "fs";
import path from "path";

export const getStaticPeriodParams = async (): Promise<{ period: string }[]> => {
  const csvPath = path.join(process.cwd(), "public", "csv", "regulation-item.csv");
  const csvText = fs.readFileSync(csvPath, "utf-8");
  const rows = csvText.split("\n").slice(1);
  const ids = rows
    .map((row) => row.split(",")[0].trim())
    .filter((id) => /^\d+$/.test(id));
  return ids.map((id) => ({ period: id }));
};
