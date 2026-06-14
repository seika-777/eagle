import MyPageTemplate from "@/component/templates/MyPageTemplate";
import { COMMON } from "@/const/common/COMMON";
import { MYPAGE } from "@/const/pages/MYPAGE";

export const metadata = {
  title: COMMON.SITE_NAME + "|" + MYPAGE.TEXT.TITLE,
};

export default function MyPage() {
  return <MyPageTemplate />;
}
