"use client";
import { useMemo } from "react";
import { Box, Text, Link } from "@chakra-ui/react";
import { RACE } from "@/const/common/RACE";
import { RACE_PAGE } from "@/const/pages/RACE_PAGE";
import type { RaceItemType } from "@/const/type/race/RaceItemType";
import type { RaceGroupType } from "@/const/type/race/RaceGroupType";
import type { RaceListType } from "@/const/type/race/RaceListType";
import HeadingThird from "@/component/atoms/HeadingThird";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
type Props = {
  items: RaceItemType[];
};
export default function RaceList({ items }: Props) {
  const groupByRaceType = (items: RaceItemType[]): Record<string, RaceGroupType> => {
    return items.reduce<Record<string, RaceGroupType>>((acc, item) => {
      item.raceType.forEach((rt) => {
        if (!acc[rt]) {
          acc[rt] = {
            label: rt in RACE.TEXT ? RACE.TEXT[rt as RaceListType] : rt,
            items: [],
          };
        }
        acc[rt].items.push(item);
      });
      return acc;
    }, {});
  };
  const originalItems = useMemo(() => items.filter((item) => item.url), [items]);
  const groupedByRaceType = useMemo(() => groupByRaceType(items.filter((item) => !item.url)), [items]);
  const RaceItem = ({ item }: { item: RaceItemType }) => {
    return (
      <Box as="li" py={1}>
        {item.url ? (
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            color={STYLE_COLOR.SECONDARY}
            textDecoration="underline"
            _hover={{ color: STYLE_COLOR.ACCENT }}
          >
            {item.name}({item.raceType.map((rt) => RACE.TEXT[rt as RaceListType]).join("/")})
          </Link>
        ) : (
          <Text>{item.name}</Text>
        )}
      </Box>
    );
  };
  const RaceItemList = ({ items }: { items: RaceItemType[] }) => {
    return (
      <Box as="ul" listStyleType="none" p={0} mt={2}>
        {items.map((item) => (
          <RaceItem key={item.id} item={item} />
        ))}
      </Box>
    );
  };
  return (
    <Box as="section" textAlign="left" width="100%">
      <>
        {Object.entries(groupedByRaceType).map(([key, group]) => (
          <Box key={key} mb={6}>
            <HeadingThird title={group.label} />
            <RaceItemList items={group.items} />
          </Box>
        ))}
        {originalItems.length > 0 && (
          <Box mb={6}>
            <HeadingThird title={RACE_PAGE.TEXT.originalRaceHeading} />
            <RaceItemList items={originalItems} />
          </Box>
        )}
      </>
    </Box>
  );
}
