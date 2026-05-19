import ProhibitionTemplate from "@/component/templates/ProhibitionTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const dynamic = "force-static";

export const metadata = {
  title: COMMON.SITE_NAME + "|" + METADATA.TITLE.PROHIBITION,
  description: METADATA.DESCRIPTION.PROHIBITION,
};

export default function Prohibition() {
  return <ProhibitionTemplate />;
}
