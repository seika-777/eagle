import LoginTemplate from "@/component/templates/LoginTemplate";
import { COMMON } from "@/const/common/COMMON";
import { LOGIN } from "@/const/pages/LOGIN";

export const metadata = {
  title: COMMON.SITE_NAME + "|" + LOGIN.TEXT.TITLE,
};

export default function LoginPage() {
  return <LoginTemplate />;
}
