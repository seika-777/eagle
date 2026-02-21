"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Text, Link, Spinner } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getGodItems } from "@/const/function/getGodItems";
import type { GodItemType } from "@/const/type/god/GodItemType";
import type { ErrorType } from "@/const/type/error/ErrorType";
import HeadingThird from "@/component/atoms/HeadingThird";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import { GOD } from "@/const/common/GOD";

type Props = {
  period?: string;
};

export default function GodList({ period }: Props) {
  const [items, setItems] = useState<GodItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError, resetError } = useErrorHandler();

  useEffect(() => {
    setLoading(true);
    resetError();
    const fetchData = async () => {
      try {
        const data = await getGodItems(period);
        setItems(data);
        setLoading(false);
      } catch (error) {
        handleError(error as ErrorType);
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const originalItems = useMemo(() => items.filter((item) => item.isOriginal), [items]);

  const groupedByType = useMemo(() => {
    const groups: Record<number, GodItemType[]> = {};
    items
      .filter((item) => !item.isOriginal)
      .forEach((item) => {
        if (!groups[item.type]) {
          groups[item.type] = [];
        }
        groups[item.type].push(item);
      });
    return groups;
  }, [items]);

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

  const GodItemList = ({ items }: { items: GodItemType[] }) => {
    return (
      <Box as="ul" listStyleType="none" p={0} mt={2}>
        {items.map((item) => (
          <GodItem key={item.id} item={item} />
        ))}
      </Box>
    );
  };

  return (
    <Box as="section" textAlign="left" width="100%">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {GOD.TYPE_ORDER.filter((type) => groupedByType[type]).map((type) => (
            <Box key={type} mb={6}>
              <HeadingThird title={GOD.TYPE_TEXT[type]} />
              <GodItemList items={groupedByType[type]} />
            </Box>
          ))}
          {originalItems.length > 0 && (
            <Box mb={6}>
              <HeadingThird title="オリジナル信仰" />
              <GodItemList items={originalItems} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
