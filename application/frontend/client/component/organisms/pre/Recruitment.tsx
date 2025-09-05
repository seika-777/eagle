"use client";

import { Box, Text } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";

export default function Recruitment() {
  return (
    <Box as="section">
      <HeadingSecond title="RECRUITMENT" />
      <HeadingThird title="募集要項" />

      <Box>
        <Text>
          ソード・ワールド2.5コミュニティ『隻翼の大鷲亭』7期の募集になります。
        </Text>
        <Text>募集種別はGM・PL不問。両方で遊ぶ事も可能です。</Text>
        <Text>
          形式はレベルキャップシステムを採用したオープンワールドキャンペーン(初期作成～LV12)です。
        </Text>
        <Box>
          <Text as="h4">期間</Text>
          <Box as="ul">
            <Box as="li">10/16～：キャラ作成開始</Box>
            <Box as="li">11/6～：キャンペーンスタート(約半年)</Box>
          </Box>
        </Box>
        <Box>
          <Text as="h4">必須</Text>
          <Box as="ul">
            <Text as="li">基本ルールブックⅠ～Ⅲ</Text>
            <Text as="li">オンラインセッションを行える環境(PC推奨)</Text>
            <Text as="li">Discordアカウント</Text>
            <Text as="li">余裕を持って卓に参加できる時間</Text>
            <Text as="li">楽しむ心</Text>
          </Box>
        </Box>
        <Box>
          <Text as="h4">コアタイム</Text>
          <Text>21:30～26:30</Text>
        </Box>
      </Box>
    </Box>
  );
}
