"use client";
import { Accordion } from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";
import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  variant?: "section" | "field";
};

export default function AccordionSection({ title, children, variant = "section" }: Props) {
  const isField = variant === "field";

  return (
    <Accordion.Root collapsible>
      <Accordion.Item value={title} borderBottomWidth={isField ? "0" : undefined}>
        <Accordion.ItemTrigger
          py={isField ? 0 : 3}
          gap={isField ? 1 : undefined}
          textStyle={isField ? "sm" : undefined}
          fontWeight={isField ? "medium" : "bold"}
          cursor="pointer"
        >
          {title}
          <Accordion.ItemIndicator ml={isField ? undefined : "auto"}>
            <LuChevronDown />
          </Accordion.ItemIndicator>
        </Accordion.ItemTrigger>
        <Accordion.ItemContent pt={isField ? 1.5 : 1} pb={isField ? 0 : 4}>
          {children}
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
