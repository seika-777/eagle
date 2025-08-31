"use client";

import { Box } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";

export default function About() {
  return (
    <Box as="section">
      <HeadingSecond title="ABOUT" />
      <HeadingThird title="片翼の大鷲亭" />
    </Box>
  );
}
