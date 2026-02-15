import {
  Edu_NSW_ACT_Cursive,
  Zen_Kaku_Gothic_New,
  Zen_Maru_Gothic,
  Zen_Old_Mincho,
} from "next/font/google";

const eduNswActCursive = Edu_NSW_ACT_Cursive({
  variable: "--font-edu-nsw-act-cursive",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const zenKakuGochicNew = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-gothic-new",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});
const zenOldMincho = Zen_Old_Mincho({
  variable: "--font-zen-old-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export { eduNswActCursive, zenKakuGochicNew, zenMaruGothic, zenOldMincho };
