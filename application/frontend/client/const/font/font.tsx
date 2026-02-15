import { Edu_NSW_ACT_Cursive, Zen_Maru_Gothic } from "next/font/google";

const eduNswActCursive = Edu_NSW_ACT_Cursive({
  variable: "--font-edu-nsw-act-cursive",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export { eduNswActCursive, zenMaruGothic };
