import OriginalTemplate from "@/component/templates/OriginalTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const dynamic = "force-static";

export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.ORIGINAL,
  description: METADATA.DESCRIPTION.ORIGINAL,
};

export default function Original() {
  return <OriginalTemplate />;
}
