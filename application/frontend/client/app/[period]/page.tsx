import RegulationTemplate from "@/component/templates/RegulationTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.REGULATION,
  description: "Home page of the application",
};

export default async function Regulation({
  params,
}: {
  params: Promise<{ period: string }>;
}) {
  const { period } = await params;
  return <RegulationTemplate period={period} />;
}
