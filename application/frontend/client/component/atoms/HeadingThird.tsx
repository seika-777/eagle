"use client";
import { Text } from "@chakra-ui/react";

interface Props {
  title: string;
}

export default function HeadingThird({ title }: Props) {
  return <Text as="h3">{title}</Text>;
}
