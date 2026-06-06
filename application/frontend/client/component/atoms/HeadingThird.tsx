"use client";
import { Text } from "@chakra-ui/react";

type Props = {
  title: string;
};

export default function HeadingThird({ title }: Props) {
  return (
    <Text as="h3" fontSize="20px" fontFamily="var(--font-edu-nsw-act-cursive), var(--font-zen-maru-gothic)">
      {title}
    </Text>
  );
}
