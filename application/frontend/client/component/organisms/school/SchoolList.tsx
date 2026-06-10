"use client";
import { useMemo } from "react";
import { Box, Text, Link } from "@chakra-ui/react";
import type { SchoolItemType } from "@/const/type/school/SchoolItemType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { SCHOOL_PAGE } from "@/const/pages/SCHOOL_PAGE";

type Props = {
  items: SchoolItemType[];
};

export default function SchoolList({ items }: Props) {
  const standardItems = useMemo(
    () => items.filter((item) => !item.url),
    [items],
  );

  const originalItems = useMemo(
    () => items.filter((item) => item.url),
    [items],
  );

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
      <HeadingSecond title={SCHOOL_PAGE.TEXT.heading} />
      <>
        <Box as="ul" listStyleType="none" p={0} mt={2}>
          {standardItems.map((item) => (
            <SchoolItem key={item.id} item={item} />
          ))}
        </Box>
        {originalItems.length > 0 && (
          <Box mt={6}>
            <HeadingSecond title={SCHOOL_PAGE.TEXT.originalHeading} />
            <Box as="ul" listStyleType="none" p={0} mt={2}>
              {originalItems.map((item) => (
                <SchoolItem key={item.id} item={item} />
              ))}
            </Box>
          </Box>
        )}
      </>
    </Box>
  );
}
