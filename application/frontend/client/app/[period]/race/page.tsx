import fs from "fs";
import path from "path";
import RaceTemplate from "@/component/templates/RaceTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export async function generateStaticParams() {
  const csvPath = path.join(process.cwd(), "public", "csv", "regulation-item.csv");
  const csvText = fs.readFileSync(csvPath, "utf-8");
  const rows = csvText.split("\n").slice(1);
  const ids = rows
    .map((row) => row.split(",")[0].trim())
    .filter((id) => /^\d+$/.test(id));
  return ids.map((id) => ({ period: id }));
}

export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.RACE,
  description: "Home page of the application",
};

export default async function Race({
  params,
}: {
  params: Promise<{ period: string }>;
}) {
  const { period } = await params;
  return <RaceTemplate period={period} />;
}
