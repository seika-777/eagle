import LoginTemplate from "@/component/templates/LoginTemplate";
import { getOptions } from "@/const/function/getOptions";
import { LOGIN } from "@/const/pages/LOGIN";

export async function generateMetadata() {
  const options = await getOptions();
  return {
    title: options.siteName + "|" + LOGIN.TEXT.TITLE,
  };
}

export default function LoginPage() {
  return <LoginTemplate />;
}
