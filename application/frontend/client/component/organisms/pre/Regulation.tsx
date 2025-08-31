"use client";

import { Box } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";

export default function Regulation() {
  return (
    <Box as="section">
      <HeadingSecond title="REGULATION" />
      <HeadingThird title="レギュレーション" />
    </Box>
  );
}
