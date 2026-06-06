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
                <Box mt={1} color={STYLE_COLOR.BLACK} className="word-description">
                  <style>{`
                    .word-description p { margin-bottom: 0.5em; }
                    .word-description ul, .word-description ol { padding-left: 1.5em; margin-bottom: 0.5em; }
                    .word-description strong { font-weight: bold; }
                    .word-description em { font-style: italic; }
                    .word-description h2 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; }
                    .word-description h3 { font-size: 1.1em; font-weight: bold; margin-bottom: 0.5em; }
                    .word-description a { color: #3182ce; text-decoration: underline; }
                    .word-description ruby rt { font-size: 0.5em; }
                  `}</style>
                  <div dangerouslySetInnerHTML={{ __html: item.description }} />
                </Box>
              )}
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
