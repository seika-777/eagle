import type { LevelCapGuideSection } from "@/const/type/levelCap/LevelCapGuideSectionType";

export const LEVEL_CAP_PAGE: {
  TEXT: { [key: string]: string };
  VALUE: { [key: string]: string };
  GUIDE: LevelCapGuideSection[];
} = {
  TEXT: {
    title: "レベルキャップ",
    processTitle: "レベルキャップ処理",
    gmRewardTitle: "GM報酬",
    sessionRewardTitle: "セッション報酬",
    levelHeader: "Lv.",
    minExpHeader: "下限Exp.(点)",
    minGrowthHeader: "下限成長(回)",
    minRewardHeader: "下限報酬(G)",
    minHonorHeader: "下限名誉(点)",
    maxAdventurerRankHeader: "上限冒険者ランク",
    rewardAmountHeader: "報酬金額",
    offBalanceRewardHeader: "収支外報酬",
    honorHeader: "名誉点",
    distributionHeader: "配給",
    rewardPerSessionHeader: "1卓の報酬目安",
    swordFragmentsHeader: "剣の欠片目安",
    growthCountHeader: "成長回数",
    growthLimitHeader: "成長上限",
    expLimitHeader: "経験点上限",
    fCountLimitHeader: "F回数上限",
    rewardLimitHeader: "報酬上限",
    excessGrowthHeader: "超過成長(1/4)",
    processFootnote: "※このキャップではF(ファンブル)による経験点は上昇しません。",
    gmRewardDescription: "GMはセッションごとに以下の表を用いて報酬を獲得できます。\nまた、GMは1セッションにつき、最低2回ファンブルを獲得することができます。または、参加者の誰かがファンブルした回数と同じだけ獲得することもできます。\nGMの成長は一律で3d6で行われ、成長回数も他PLと大差ありません。\n収支外報酬は+配給分であり、報酬の上限値を無視して適応できます。",
  },
  VALUE: {
    typeB: "B",
    typeC: "C",
  },
  GUIDE: [
    {
      title: "レベルキャップ",
      description: "そのレベルキャップでは「〇〇キャップ」と書かれている数字までしか冒険者レベルを上げれません。\n2キャップであれば最大2レベル、5キャップであれば最大5レベル。\n11-12キャップに関しては12レベルまで冒険者レベルを上げる事が可能です。",
    },
    {
      title: "上限経験点と下限経験値",
      description: "新たなキャップ開放時に使用できる経験値量の事を指します。\n経験点はキャラクターシートの「成長履歴」の「獲得総計」を指します。\n各キャップ事に記載されている経験値量を適用し、依頼達成等による経験点増加はありません。\n尚、固定経験値による経験点補填はピンゾロ経験点を計算しないものとし、最終的な経験点量は「獲得経験値+ピンゾロ経験点」になります。",
    },
    {
      title: "下限成長",
      description: "そのキャップ開放時に貰える成長回数の事を指します。\n各キャップ事に記載されている回数の分だけ成長できます。",
    },
    {
      title: "下限所持金",
      description: "そのキャップ開放時に貰える所持金の事を指します。\n所持金はキャラクターシートの「成長履歴」の「報酬：計〇〇Ｇ」を指します。",
    },
    {
      title: "上限報酬",
      description: "キャップごとに上限報酬を設定しています。これはキャップごとに更新されます。\n報酬の総額がその上限値に満たない場合、PCは満額の報酬を受け取ることができます。しかし、上限値に達してしまった場合、上限値を越えた(もしくは届いた)次の卓より、もらえる報酬額が1/4(端数切上)になります。配給でいただけるアイテムや報酬は一律変わりませんのでお気を付けください。",
    },
    {
      title: "下限名誉点",
      description: "そのキャップ開放時に貰える名誉点の事を指します。\n名誉点はキャラクターシートの「名誉点」の「入手名誉点」を指します。",
    },
    {
      title: "ピンゾロ使用上限経験点",
      description: "キャップの上限経験点を超えてピンゾロ分の経験点を使用できます。\n使用できる経験点はキャップ事に制定されていますのでご確認ください。\n尚、「上限経験点を超えて使用できる経験点」が決まっているだけなのでピンゾロ回数自体はカウントされ、次のキャップ解放時にすぐ適用されます。\n※ピンゾロは60回分までしか経験値として得られませんが61回目以降のピンゾロに関しては「ピンゾロ一回」を「名誉点10点」に変換して取得する事が可能です。\n変換する場合には成長履歴に『ピンゾロ〇回名誉変換』と記載をお願い致します。",
    },
  ],
} as const;
