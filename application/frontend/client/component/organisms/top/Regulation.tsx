"use client";

import { Box, Text, Link } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";
import { TOP_PAGE } from "@/const/pages/TOP_PAGE";
import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";
type Props = {
  latestRegulation: RegulationItemType | null;
  regulationText: string;
};
export default function Regulation({ latestRegulation, regulationText }: Props) {
  return (
    <Box as="section">
      <HeadingSecond title={TOP_PAGE.TEXT.regulationTitle} />
      <HeadingThird title={TOP_PAGE.TEXT.regulationSubTitle} />
      <Text whiteSpace="pre-line">{regulationText}</Text>
      <Link href={`/${latestRegulation?.regulation.id}`}>
        {TOP_PAGE.TEXT.detailLinkLabel}
      </Link>
    </Box>
  );
}
