"use client";
import { useEffect, useState } from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getItems } from "@/const/function/getItems";
import { WORD_PAGE } from "@/const/pages/WORD_PAGE";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";
import type { WordItemType } from "@/const/type/word/WordItemType";
import type { ErrorType } from "@/const/type/error/ErrorType";
import HeadingSecond from "@/component/atoms/HeadingSecond";
import AccordionList from "@/component/molecules/AccordionList";

export default function WordList() {
  const [items, setItems] = useState<WordItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError, resetError } = useErrorHandler();

  useEffect(() => {
    setLoading(true);
    resetError();
    const fetchData = async () => {
      try {
        const data = await getItems<WordItemType>("word");
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
      <style>{`
        div.word-description p { margin-top: 0 !important; margin-bottom: 0.75em !important; white-space: pre-wrap; }
        div.word-description p:last-child { margin-bottom: 0 !important; }
        div.word-description ul, div.word-description ol { padding-left: 1.5em; margin-bottom: 0.75em; }
        div.word-description strong { font-weight: bold; }
        div.word-description em { font-style: italic; }
        div.word-description h2 { font-size: 1.25em; font-weight: bold; margin: 0.5em 0; }
        div.word-description h3 { font-size: 1.1em; font-weight: bold; margin: 0.5em 0; }
        div.word-description a { color: ${STYLE_COLOR.SECONDARY}; text-decoration: underline; }
        div.word-description ruby rt { font-size: 0.5em; }
      `}</style>
      <HeadingSecond title={WORD_PAGE.TEXT.heading} />
      {loading ? (
        <Spinner mt={4} />
      ) : items.length === 0 ? (
        <Text mt={4}>{WORD_PAGE.TEXT.empty}</Text>
      ) : (
        <Box mt={4}>
          <AccordionList
            items={items}
            descriptionClassName="word-description"
            htmlDescription={true}
          />
        </Box>
      )}
    </Box>
  );
}
