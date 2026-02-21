"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Text, Link, Spinner } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getSchoolItems } from "@/const/function/getSchoolItems";
import type { SchoolItemType } from "@/const/type/school/SchoolItemType";
import type { ErrorType } from "@/const/type/error/ErrorType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { SCHOOL_PAGE } from "@/const/pages/SCHOOL_PAGE";

type Props = {
  period?: string;
};

export default function SchoolList({ period }: Props) {
  const [items, setItems] = useState<SchoolItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError, resetError } = useErrorHandler();

  useEffect(() => {
    setLoading(true);
    resetError();
    const fetchData = async () => {
      try {
        const data = await getSchoolItems(period);
        setItems(data);
        setLoading(false);
      } catch (error) {
        handleError(error as ErrorType);
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const standardItems = useMemo(
    () => items.filter((item) => !item.isOriginal),
    [items],
  );

  const originalItems = useMemo(
    () => items.filter((item) => item.isOriginal),
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
      {loading ? (
        <Spinner />
      ) : (
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
      )}
    </Box>
  );
}
