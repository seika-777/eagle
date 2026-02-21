import RegulationTemplate from "@/component/templates/RegulationTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.REGULATION,
  description: METADATA.DESCRIPTION.REGULATION,
};

export default function Regulation() {
  return <RegulationTemplate />;
}
