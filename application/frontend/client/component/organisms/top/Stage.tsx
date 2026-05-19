"use client";

import { Box, Text } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";
import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";
type Props = {
  latestRegulation: RegulationItemType | null;
};
export default function Stage({ latestRegulation }: Props) {
  return (
    <Box as="section">
      <HeadingSecond title="STAGE" />
      {latestRegulation && (
        <>
          <HeadingThird title={latestRegulation.regulation.name} />
          <Box>
            {latestRegulation.regulation.description.split("\n").map((line: string, index: number) => (
              <Text key={index}>{line || "\u00A0"}</Text>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
