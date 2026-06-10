"use client";
import { useMemo } from "react";
import { Box, Text, Link } from "@chakra-ui/react";
import { ORIGINAL_PAGE } from "@/const/pages/ORIGINAL_PAGE";
import { RACE } from "@/const/common/RACE";
import type { RaceItemType } from "@/const/type/race/RaceItemType";
import type { RaceListType } from "@/const/type/race/RaceListType";
import type { GodItemType } from "@/const/type/god/GodItemType";
import type { SchoolItemType } from "@/const/type/school/SchoolItemType";
import type { OriginalItemType } from "@/const/type/original/OriginalItemType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

type Props = {
  raceItems: RaceItemType[];
  godItems: GodItemType[];
  schoolItems: SchoolItemType[];
  originalItems: OriginalItemType[];
};

export default function OriginalList({ raceItems, godItems, schoolItems, originalItems }: Props) {
  const originalRaceItems = useMemo(() => raceItems.filter((item) => item.url), [raceItems]);
  const originalGodItems = useMemo(() => godItems.filter((item) => item.url), [godItems]);
  const originalSchoolItems = useMemo(() => schoolItems.filter((item) => item.url), [schoolItems]);

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

  const GodItem = ({ item }: { item: GodItemType }) => {
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
            {item.name}
          </Link>
        ) : (
          <Text>{item.name}</Text>
        )}
      </Box>
    );
  };

  const OriginalItem = ({ item }: { item: OriginalItemType }) => {
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
            {item.name}({item.type})
          </Link>
        ) : (
          <Text>{item.name}({item.type})</Text>
        )}
      </Box>
    );
  };

  const SchoolItem = ({ item }: { item: SchoolItemType }) => {
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
            {item.name}
          </Link>
        ) : (
          <Text>{item.name}</Text>
        )}
      </Box>
    );
  };

  return (
    <Box as="section" textAlign="left" width="100%">
      <>
        {originalRaceItems.length > 0 && (
          <Box mb={8}>
            <HeadingSecond title={ORIGINAL_PAGE.TEXT.raceHeading} />
            <Box as="ul" listStyleType="none" p={0} mt={2}>
              {originalRaceItems.map((item) => (
                <RaceItem key={item.id} item={item} />
              ))}
            </Box>
          </Box>
        )}
        {originalGodItems.length > 0 && (
          <Box mb={8}>
            <HeadingSecond title={ORIGINAL_PAGE.TEXT.godHeading} />
            <Box as="ul" listStyleType="none" p={0} mt={2}>
              {originalGodItems.map((item) => (
                <GodItem key={item.id} item={item} />
              ))}
            </Box>
          </Box>
        )}
        {originalSchoolItems.length > 0 && (
          <Box mb={8}>
            <HeadingSecond title={ORIGINAL_PAGE.TEXT.schoolHeading} />
            <Box as="ul" listStyleType="none" p={0} mt={2}>
              {originalSchoolItems.map((item) => (
                <SchoolItem key={item.id} item={item} />
              ))}
            </Box>
          </Box>
        )}
        {originalItems.length > 0 && (
          <Box mb={8}>
            <HeadingSecond title={ORIGINAL_PAGE.TEXT.itemHeading} />
            <Box as="ul" listStyleType="none" p={0} mt={2}>
              {originalItems.map((item) => (
                <OriginalItem key={item.id} item={item} />
              ))}
            </Box>
          </Box>
        )}
      </>
    </Box>
  );
}
