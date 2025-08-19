import HomeTemplate from "@/component/templates/HomeTemplate";
import { COMMON } from "@/const/common/COMMON";
import { METADATA } from "@/const/common/METADATA";

export const metadata = {
  title: COMMON.SITE_NAME + " - " + METADATA.TITLE.HOME,
  description: "Home page of the application",
};
export default function Home() {
  return <HomeTemplate />;
}
