import HomeTemplate from "@/component/templates/HomeTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";
export const dynamic = "force-static";
export const metadata = {
  title: COMMON.SITE_NAME,
  description: METADATA.DESCRIPTION.HOME,
};
export default function Home() {
  return <HomeTemplate />;
}
