"use client";
import { useEffect, useState } from "react";
import { Box, Text, Spinner, SimpleGrid } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getWordItems } from "@/const/function/getWordItems";
import { WORD_PAGE } from "@/const/pages/WORD_PAGE";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import type { WordItemType } from "@/const/type/word/WordItemType";
import type { ErrorType } from "@/const/type/error/ErrorType";
import HeadingSecond from "@/component/atoms/HeadingSecond";

export default function WordList() {
  const [items, setItems] = useState<WordItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError, resetError } = useErrorHandler();

  useEffect(() => {
    setLoading(true);
    resetError();
    const fetchData = async () => {
      try {
        const data = await getWordItems();
        setItems(data);
        setLoading(false);
      } catch (error) {
        handleError(error as ErrorType);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box as="section" textAlign="left" width="100%">
      <HeadingSecond title={WORD_PAGE.TEXT.heading} />
      {loading ? (
        <Spinner />
      ) : (
        <SimpleGrid gap={4} mt={4}>
          {items.map((item) => (
            <Box key={item.id} borderBottom={`1px solid ${STYLE_COLOR.LIGHT}`} pb={4}>
              <Text fontWeight="bold">{item.title}</Text>
              {item.description && (
                <Text mt={1} color={STYLE_COLOR.BLACK}>{item.description}</Text>
              )}
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
