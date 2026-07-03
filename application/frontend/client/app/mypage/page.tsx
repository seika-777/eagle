import MyPageTemplate from "@/component/templates/MyPageTemplate";
import { getOptions } from "@/const/function/getOptions";
import { MYPAGE } from "@/const/pages/MYPAGE";

export async function generateMetadata() {
  const options = await getOptions();
  return {
    title: options.siteName + "|" + MYPAGE.TEXT.TITLE,
  };
}

export default function MyPage() {
  return <MyPageTemplate />;
}
