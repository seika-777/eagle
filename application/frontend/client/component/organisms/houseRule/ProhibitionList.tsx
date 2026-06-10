"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Spinner } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getItems } from "@/const/function/getItems";
import type { ProhibitionItemType } from "@/const/type/houseRule/ProhibitionItemType";
import type { ErrorType } from "@/const/type/error/ErrorType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import AccordionList from "@/component/molecules/AccordionList";

export default function ProhibitionList() {
  const [items, setItems] = useState<ProhibitionItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError, resetError } = useErrorHandler();

  useEffect(() => {
    setLoading(true);
    resetError();
    const fetchData = async () => {
      try {
        const data = await getItems<ProhibitionItemType>("prohibition");
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
        <Box mt={4}>
          <AccordionList
            items={groupedByAbout.map(({ about, items: groupItems }) => ({
              id: about,
              title: about,
              description: groupItems.map((item) => item.name).join("\n"),
            }))}
          />
        </Box>
      )}
    </Box>
  );
}
