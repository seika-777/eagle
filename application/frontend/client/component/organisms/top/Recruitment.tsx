"use client";

import { Box, Text } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";
import type { RegulationItemType } from "@/const/type/regulation/RegulationItemType";
type Props = {
  latestRegulation: RegulationItemType | null;
};
export default function Recruitment({ latestRegulation }: Props) {
  return (
    <Box as="section">
      <HeadingSecond title="RECRUITMENT" />
      <HeadingThird title="募集要項" />
      {latestRegulation && (
        <Box>
          {latestRegulation.recruitment.split("\n").map((line, index) => (
            <Text key={index}>{line || "\u00A0"}</Text>
          ))}
        </Box>
      )}
    </Box>
  );
}
