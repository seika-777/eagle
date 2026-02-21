"use client";
import { useEffect, useState } from "react";
import { Box, Spinner } from "@chakra-ui/react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getRegulationListItems } from "@/const/function/getRegulationListItems";
import { PERIOD_PAGE } from "@/const/pages/PERIOD_PAGE";
import type { RegulationListItemType } from "@/const/type/regulation/RegulationListItemType";
import type { ErrorType } from "@/const/type/error/ErrorType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

export default function PeriodList() {
  const [items, setItems] = useState<RegulationListItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError, resetError } = useErrorHandler();

  useEffect(() => {
    setLoading(true);
    resetError();
    const fetchData = async () => {
      try {
        const data = await getRegulationListItems();
        setItems(data);
        setLoading(false);
      } catch (error) {
        handleError(error as ErrorType);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const PeriodItem = ({ item }: { item: RegulationListItemType }) => {
    return (
      <Box as="li" py={1}>
        <Link
          as={NextLink}
          href={`/${item.id}`}
          color={STYLE_COLOR.SECONDARY}
          textDecoration="underline"
          _hover={{ color: STYLE_COLOR.ACCENT }}
        >
          第{item.id}期 {item.name}
        </Link>
      </Box>
    );
  };

  return (
    <Box as="section" textAlign="left" width="100%">
      {loading ? (
        <Spinner />
      ) : (
        <Box>
          <HeadingSecond title={PERIOD_PAGE.TEXT.heading} />
          <Box as="ul" listStyleType="none" p={0} mt={2}>
            {items.map((item) => (
              <PeriodItem key={item.id} item={item} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
