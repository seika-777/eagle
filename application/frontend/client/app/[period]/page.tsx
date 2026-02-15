import { getStaticPeriodParams } from "@/api/variables/getStaticPeriodParams";
import RegulationTemplate from "@/component/templates/RegulationTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const generateStaticParams = getStaticPeriodParams;

export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.REGULATION,
  description: METADATA.DESCRIPTION.REGULATION,
};

export default async function Regulation({
  params,
}: {
  params: Promise<{ period: string }>;
}) {
  const { period } = await params;
  return <RegulationTemplate period={period} />;
}
