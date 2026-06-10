import StageTermTemplate from "@/component/templates/StageTermTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";
import { getItems } from "@/const/function/getItems";
import type { StageTermItemType } from "@/const/type/stageTerm/StageTermItemType";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.STAGE_TERM,
  description: METADATA.DESCRIPTION.STAGE_TERM,
};

export default async function StageTerm() {
  const items = await getItems<StageTermItemType>("stage-term");
  return <StageTermTemplate items={items} />;
}
