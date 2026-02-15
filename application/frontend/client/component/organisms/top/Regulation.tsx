"use client";

import { Box, Text, Link } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";
import { PATH } from "@/const/common/PATH";
import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";
type Props = {
  latestRegulation: RegulationItemType | null;
};
export default function Regulation({ latestRegulation }: Props) {
  return (
    <Box as="section">
      <HeadingSecond title="REGULATION" />
      <HeadingThird title="レギュレーション" />
      <Box as="ul">
        <Text as="li">キャラクター作成は専用サーバーおよび、専用のココフォリアルームで作成</Text>
        <Text as="li">初期作成よりスタート</Text>
        <Text as="li">
          {PATH.LINK.LVCB[latestRegulation?.regulation.levelCapBelt as keyof typeof PATH.LINK.LVCB] ? (
            <Link
              href={PATH.LINK.LVCB[latestRegulation?.regulation.levelCapBelt as keyof typeof PATH.LINK.LVCB]}
              target="_blank"
              rel="noopener noreferrer"
            >
              レベルキャップシステム
            </Link>
          ) : (
            <>レベルキャップシステム</>
          )}
          を採用
        </Text>
        <Text as="li">使用サプリはエピックトレジャリー、モンストラスロア他</Text>
        <Text as="li">使用可能種族は人族基本種・希少種(一部制限あり)</Text>
      </Box>
      <Link href={`/${latestRegulation?.regulation.id}`}>
        詳しくはこちら
      </Link>
    </Box>
  );
}
