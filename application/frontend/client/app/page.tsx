import HomeTemplate from "@/component/templates/HomeTemplate";
import { COMMON } from "@/const/common/COMMON";

export const metadata = {
  title: COMMON.SITE_NAME,
  description: "Home page of the application",
};

export default function Home() {
  return <HomeTemplate />;
}
