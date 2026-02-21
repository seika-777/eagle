import GodTemplate from "@/component/templates/GodTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.GOD,
  description: METADATA.DESCRIPTION.GOD,
};

export default function God() {
  return <GodTemplate />;
}
