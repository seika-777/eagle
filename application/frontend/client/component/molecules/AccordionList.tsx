"use client";
import { Accordion, Box, Text } from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";
import { STYLE_COLOR } from "@/const/style/STYLE_COLOR";

type AccordionItemType = {
  id: number | string;
  title: string;
  description?: string | null;
  footer?: string | null;
};

type Props = {
  items: AccordionItemType[];
  descriptionClassName?: string;
  htmlDescription?: boolean;
};

export default function AccordionList({ items, descriptionClassName, htmlDescription = false }: Props) {
  return (
    <Accordion.Root multiple collapsible variant="plain" display="flex" flexDirection="column" gap={3} width="100%">
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={String(item.id)}
          borderWidth="1px"
          borderColor={STYLE_COLOR.LIGHT}
          borderRadius="md"
          overflow="hidden"
          boxShadow="sm"
          minWidth={0}
        >
          <Accordion.ItemTrigger
            px={4}
            py={3}
            fontWeight="bold"
            color={STYLE_COLOR.BLACK}
            borderLeft={`4px solid ${STYLE_COLOR.SECONDARY}`}
            _hover={{ bg: STYLE_COLOR.LIGHT, color: STYLE_COLOR.PRIMARY }}
            cursor={item.description || item.footer ? "pointer" : "default"}
            disabled={!item.description && !item.footer}
            transition="background 0.15s"
          >
            {item.title}
            {(item.description || item.footer) && (
              <Accordion.ItemIndicator ml="auto" color={STYLE_COLOR.SECONDARY}>
                <LuChevronDown />
              </Accordion.ItemIndicator>
            )}
          </Accordion.ItemTrigger>
          {(item.description || item.footer) && (
            <Accordion.ItemContent px={4} pt={3} pb={4} bg={STYLE_COLOR.LIGHT} overflow="hidden">
              {item.description && (
                htmlDescription ? (
                  <Box
                    color={STYLE_COLOR.BLACK}
                    className={descriptionClassName}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                    wordBreak="break-word"
                    overflowWrap="break-word"
                  />
                ) : (
                  <Box color={STYLE_COLOR.BLACK} className={descriptionClassName} whiteSpace="pre-wrap" wordBreak="break-word" overflowWrap="break-word">
                    {item.description}
                  </Box>
                )
              )}
              {item.footer && (
                <Text mt={item.description ? 3 : 0} fontSize="sm" color={STYLE_COLOR.PRIMARY} fontWeight="bold">
                  {item.footer}
                </Text>
              )}
            </Accordion.ItemContent>
          )}
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
