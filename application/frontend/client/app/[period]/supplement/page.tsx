import SupplementTemplate from "@/component/templates/SupplementTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.SUPPLEMENT,
  description: METADATA.DESCRIPTION.SUPPLEMENT,
};

export default function Supplement() {
  return <SupplementTemplate />;
}
