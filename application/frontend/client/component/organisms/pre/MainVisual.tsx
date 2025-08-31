"use client";
import { PATH } from "@/const/common/PATH";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { Box, Image, Text } from "@chakra-ui/react";

export default function MainVisual() {
  return (
    <Box
      bgColor={STYLE_COLOR.MAIN}
      height={"210px"}
      paddingTop={"60px"}
      position={"relative"}
    >
      <Image
        src={PATH.IMG.MAIN_VISUAL.BOOK}
        alt="book"
        width={"149px"}
        display={"block"}
        position={"absolute"}
        top={"30%"}
        right={"50%"}
        transform={"translateX(50%)"}
      />
      <Image
        src={PATH.IMG.MAIN_VISUAL.PEN}
        alt="book"
        width={"42px"}
        display={"block"}
        position={"absolute"}
        top={"30%"}
        right={"40%"}
        zIndex={1}
      />
      <Text
        as="h1"
        color={STYLE_COLOR.WHITE}
        fontSize={"32px"}
        width={"100%"}
        position={"absolute"}
        top={"60%"}
        left={"0"}
        textAlign={"center"}
        zIndex={2}
      >
        Fabulas simul texamus.
      </Text>
    </Box>
  );
}
