import SupplementTemplate from "@/component/templates/SupplementTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.SUPPLEMENT,
  description: METADATA.DESCRIPTION.SUPPLEMENT,
};

export default async function Supplement({
  params,
}: {
  params: Promise<{ period: string }>;
}) {
  const { period } = await params;
  return <SupplementTemplate period={period} />;
}
