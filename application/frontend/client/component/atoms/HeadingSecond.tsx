"use client";
import { PATH } from "@/const/common/PATH";
import { Image, Text } from "@chakra-ui/react";

interface Props {
  title: string;
}

export default function HeadingSecond({ title }: Props) {
  return (
    <Text as="h2" display="flex" alignItems="center" fontSize="30px">
      <Image src={PATH.IMG.COMMON.LOGO} alt="logo" width={"50px"} />
      {title}
    </Text>
  );
}
