"use client";

import { Box, Link, Text } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";
import { TOP_PAGE } from "@/const/pages/TOP_PAGE";

type Props = {
  contactText: string;
  contactXUrl: string;
};

export default function Contact({ contactText, contactXUrl }: Props) {
  return (
    <Box as="section">
      <HeadingSecond title={TOP_PAGE.TEXT.contactTitle} />
      <HeadingThird title={TOP_PAGE.TEXT.contactSubTitle} />
      <Link href={contactXUrl} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" width="24px" height="24px" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <Text as="span" whiteSpace="pre-line">
          {contactText}
        </Text>
      </Link>
    </Box>
  );
}
