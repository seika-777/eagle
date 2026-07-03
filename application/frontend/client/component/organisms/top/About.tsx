"use client";

import { Box, Text } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";
import { TOP_PAGE } from "@/const/pages/TOP_PAGE";

type Props = {
  siteName: string;
  aboutText: string;
};

export default function About({ siteName, aboutText }: Props) {
  return (
    <Box as="section">
      <HeadingSecond title={TOP_PAGE.TEXT.aboutTitle} />
      <HeadingThird title={siteName} />
      <Text whiteSpace="pre-line">{aboutText}</Text>
    </Box>
  );
}
