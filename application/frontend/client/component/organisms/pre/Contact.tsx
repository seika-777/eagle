"use client";

import { Box } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";

export default function Contact() {
  return (
    <Box as="section">
      <HeadingSecond title="CONTACT" />
      <HeadingThird title="お問い合わせ" />
    </Box>
  );
}
