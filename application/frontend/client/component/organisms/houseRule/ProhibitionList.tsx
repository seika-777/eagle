"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Text, Link, Spinner, SimpleGrid } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getProhibitionItems } from "@/api/variables/getProhibitionItems";
import type { ProhibitionItemType } from "@/const/type/houseRule/ProhibitionItemType";
import type { ErrorType } from "@/const/type/error/ErrorType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import HeadingThird from "@/component/atoms/HeadingThird";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

export default function ProhibitionList() {
  const [items, setItems] = useState<ProhibitionItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError, resetError } = useErrorHandler();

  useEffect(() => {
    setLoading(true);
    resetError();
    const fetchData = async () => {
      try {
        const data = await getProhibitionItems();
        setItems(data);
        setLoading(false);
      } catch (error) {
        handleError(error as ErrorType);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupedByAbout = useMemo(() => {
    const groups: { about: string; items: ProhibitionItemType[] }[] = [];
    items.forEach((item) => {
      const existing = groups.find((g) => g.about === item.about);
      if (existing) {
        existing.items.push(item);
      } else {
        groups.push({ about: item.about, items: [item] });
      }
    });
    return groups;
  }, [items]);

  return (
    <Box as="section" textAlign="left" width="100%">
      <HeadingSecond title="使用禁止アイテム" />
      {loading ? (
        <Spinner />
      ) : (
        <SimpleGrid gap={8} mt={4}>
          <Box as="nav">
            <HeadingThird title="目次" />
            <Box as="ul" listStyleType="none" p={0} mt={2}>
              {groupedByAbout.map(({ about }) => (
                <Box as="li" key={about} py={1}>
                  <Link
                    href={`#prohibition-${about}`}
                    color={STYLE_COLOR.SECONDARY}
                    textDecoration="underline"
                    _hover={{ color: STYLE_COLOR.ACCENT }}
                  >
                    {about}
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>
          {groupedByAbout.map(({ about, items: groupItems }) => (
            <Box key={about} id={`prohibition-${about}`}>
              <HeadingThird title={about} />
              <SimpleGrid gap={4} mt={2}>
                {groupItems.map((item) => (
                  <Box key={item.id} p={4} borderWidth="1px" borderRadius="md">
                    <Text whiteSpace="pre-wrap">{item.name}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
