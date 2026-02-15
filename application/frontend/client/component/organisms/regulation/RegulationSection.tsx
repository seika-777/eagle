"use client";

import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import HeadingThird from "@/component/atoms/HeadingThird";
import { PATH } from "@/const/common/PATH";
import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
type Props = {
  regulationItem: RegulationItemType;
};
export default function RegulationSection({ regulationItem }: Props) {
  const { regulation, race, supplement } = regulationItem;
  return (
    <SimpleGrid gap="4">
      <Box as="section">
        <HeadingSecond title={regulation.name || ""} />
        <Text as="a" href={PATH.LINK.LVCB[regulation.levelCapBelt as keyof typeof PATH.LINK.LVCB]} target="_blank">
          レベルキャップシステムは{regulation.levelCapBelt}を採用
        </Text>
      </Box>
      <Box as="section">
        <HeadingThird title="舞台" />
        <Text>{regulation.stage}</Text>
      </Box>
      <Box as="section">
        <HeadingThird title="使用可能種族" />
        <Text>基本種族、サプリ一部種族、オリジナル種族</Text>
        <Text as="a" href={`/${regulation.id}${PATH.URL.PERIOD.RACE}`} target="_blank">
          詳しくはこちら
        </Text>
      </Box>
      <Box as="section">
        <HeadingThird title="使用可能サプリ" />
        <Text as="a" href={`/${regulation.id}${PATH.URL.PERIOD.SUPPLEMENT}`} target="_blank">
          詳しくはこちら
        </Text>
      </Box>
    </SimpleGrid>
  );
}
