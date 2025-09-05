"use client";

import { Box, Text } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";

export default function About() {
  return (
    <Box as="section">
      <HeadingSecond title="ABOUT" />
      <HeadingThird title="片翼の大鷲亭" />
      <Text>
        片翼の大鷲亭はソード・ワールド2.5のコミュニティになります。当コミュニティはオープンCP方式で、初心者が安心して参加できるハウスルールを採用しております。
      </Text>
    </Box>
  );
}
