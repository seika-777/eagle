"use client";
import { useEffect, useState } from "react";
import { Box, Spinner, Accordion } from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";
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
      ) : (
        <Accordion.Root mt={4} multiple collapsible variant="plain" display="flex" flexDirection="column" gap={3}>
          {items.map((item) => (
            <Accordion.Item
              key={item.id}
              value={String(item.id)}
              borderWidth="1px"
              borderColor={STYLE_COLOR.LIGHT}
              borderRadius="md"
              overflow="hidden"
              boxShadow="sm"
            >
              <Accordion.ItemTrigger
                px={4}
                py={3}
                fontWeight="bold"
                color={STYLE_COLOR.BLACK}
                borderLeft={`4px solid ${STYLE_COLOR.SECONDARY}`}
                _hover={{ bg: STYLE_COLOR.LIGHT, color: STYLE_COLOR.PRIMARY }}
                cursor={item.description ? "pointer" : "default"}
                disabled={!item.description}
                transition="background 0.15s"
              >
                {item.title}
                {item.description && (
                  <Accordion.ItemIndicator ml="auto" color={STYLE_COLOR.SECONDARY}>
                    <LuChevronDown />
                  </Accordion.ItemIndicator>
                )}
              </Accordion.ItemTrigger>
              {item.description && (
                <Accordion.ItemContent px={4} pt={3} pb={4} bg={STYLE_COLOR.LIGHT}>
                  <Box
                    color={STYLE_COLOR.BLACK}
                    className="word-description"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </Accordion.ItemContent>
              )}
            </Accordion.Item>
          ))}
        </Accordion.Root>
      )}
    </Box>
  );
}
