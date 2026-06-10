"use client";
import { Box, Text, SimpleGrid, Link } from "@chakra-ui/react";
import type { SupplementItemType } from "@/const/type/supplement/SupplementItemType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import NextLink from "next/link";
import { PATH } from "@/const/common/PATH";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

type Props = {
  items: SupplementItemType[];
};

export default function SupplementList({ items }: Props) {
  return (
    <Box as="section" textAlign="left" width="100%">
      <HeadingSecond title="使用サプリメント" />
      <SimpleGrid gap={6}>
        <Text>
          ハウスルールについては<Link as={NextLink} href={PATH.URL.HOUSE_RULE.ROOT} color={STYLE_COLOR.SECONDARY} textDecoration="underline" _hover={{ color: STYLE_COLOR.ACCENT }}>こちら</Link>をご確認ください。
        </Text>
        <Box as="ul" listStyleType="none" p={0} mt={2}>
          {items.map((item) => (
            <Box as="li" key={item.id} py={1}>
              <Text>{item.name}</Text>
              {item.notes && (
                <Text fontSize="sm" color="gray.500" mt={0.5} pl={4} wordBreak="break-all">{item.notes}</Text>
              )}
            </Box>
          ))}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
