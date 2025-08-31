"use client";

import { Box } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";

export default function Recruitment() {
  return (
    <Box as="section">
      <HeadingSecond title="RECRUITMENT" />
      <HeadingThird title="募集要項" />
    </Box>
  );
}
