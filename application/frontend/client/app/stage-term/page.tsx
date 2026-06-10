import StageTermTemplate from "@/component/templates/StageTermTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.STAGE_TERM,
  description: METADATA.DESCRIPTION.STAGE_TERM,
};

export default function StageTerm() {
  return <StageTermTemplate />;
}
