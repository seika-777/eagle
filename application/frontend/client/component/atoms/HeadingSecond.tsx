"use client";
import { PATH } from "@/const/common/PATH";
import { Image, Text } from "@chakra-ui/react";

type Props = {
  title: string;
};

export default function HeadingSecond({ title }: Props) {
  return (
    <Text as="h2" display="flex" alignItems="center" fontSize="30px" fontFamily="var(--font-edu-nsw-act-cursive), var(--font-zen-maru-gothic)">
      <Image src={PATH.IMG.COMMON.LOGO} alt="logo" width={"50px"} />
      {title}
    </Text>
  );
}
