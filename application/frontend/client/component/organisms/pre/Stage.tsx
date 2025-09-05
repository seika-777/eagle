"use client";

import { Box, Text } from "@chakra-ui/react";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";

export default function Stage() {
  return (
    <Box as="section">
      <HeadingSecond title="STAGE" />
      <HeadingThird title="第七期 治癒の秘湯マリスク" />
      <Box>
        <Text>
          ザムサスカとウルシラの間に位置するこの地では、魔域を有効活用できないかと日夜様々な研究が行われています。
        </Text>
        <Text>この湯治施設もその一つ。</Text>
        <Text>
          PCたちはそこの研究員や、彼らを護衛する冒険者として日夜調査に明け暮れています。
        </Text>
      </Box>
    </Box>
  );
}
