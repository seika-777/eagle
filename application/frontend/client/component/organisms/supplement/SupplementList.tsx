"use client";
import { useEffect, useState } from "react";
import { Box, Text, Spinner, SimpleGrid, Link } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getSupplementItems } from "@/const/function/getSupplementItems";
import type { SupplementItemType } from "@/const/type/supplement/SupplementItemType";
import type { ErrorType } from "@/const/type/error/ErrorType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import NextLink from "next/link";
import { PATH } from "@/const/common/PATH";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

type Props = {
  period?: string;
};

export default function SupplementList({ period }: Props) {
  const [items, setItems] = useState<SupplementItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError, resetError } = useErrorHandler();

  useEffect(() => {
    setLoading(true);
    resetError();
    const fetchData = async () => {
      try {
        const data = await getSupplementItems(period);
        setItems(data);
        setLoading(false);
      } catch (error) {
        handleError(error as ErrorType);
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

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
            </Box>
          ))}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
