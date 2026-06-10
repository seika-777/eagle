"use client";
import { useMemo } from "react";
import { Box } from "@chakra-ui/react";
import type { ProhibitionItemType } from "@/const/type/houseRule/ProhibitionItemType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import AccordionList from "@/component/molecules/AccordionList";

type Props = {
  items: ProhibitionItemType[];
};

export default function ProhibitionList({ items }: Props) {

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
      <Box mt={4}>
        <AccordionList
          items={groupedByAbout.map(({ about, items: groupItems }) => ({
            id: about,
            title: about,
            description: groupItems.map((item) => item.name).join("\n"),
          }))}
        />
      </Box>
    </Box>
  );
}
