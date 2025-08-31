"use client";

import { Box } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";

export default function Stage() {
  return (
    <Box as="section">
      <HeadingSecond title="STAGE" />
      <HeadingThird title="舞台" />
    </Box>
  );
}
