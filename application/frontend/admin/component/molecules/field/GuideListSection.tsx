"use client";
import { Box, VStack, Button } from "@chakra-ui/react";
import AccordionSection from "@/component/molecules/AccordionSection";
import TextInputField from "@/component/molecules/field/TextInputField";
import TextareaField from "@/component/molecules/field/TextareaField";
import { BASIC_INFO } from "@/const/pages/BASIC_INFO";
import type { GuideItemType } from "@/const/type/option/GuideItemType";

type Props = {
  label: string;
  values: GuideItemType[];
  onChange: (values: GuideItemType[]) => void;
};

export default function GuideListSection({ label, values, onChange }: Props) {
  const handleRowChange = (index: number, row: GuideItemType) => {
    onChange(values.map((item, i) => (i === index ? row : item)));
  };

  const handleAdd = () => {
    onChange([...values, { title: "", description: "" }]);
  };

  const handleDelete = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <AccordionSection title={label} variant="field">
      <VStack gap={3} align="stretch">
        {values.map((item, index) => (
          <Box key={index} borderWidth="1px" borderRadius="md" p={3}>
            <VStack gap={2} align="stretch">
              <TextInputField
                label={BASIC_INFO.TEXT.GUIDE_TITLE}
                value={item.title}
                onChange={(v) => handleRowChange(index, { ...item, title: v })}
              />
              <TextareaField
                label={BASIC_INFO.TEXT.GUIDE_DESCRIPTION}
                value={item.description}
                onChange={(v) => handleRowChange(index, { ...item, description: v })}
                rows={4}
              />
              <Button
                size="sm"
                variant="outline"
                colorPalette="red"
                alignSelf="flex-start"
                onClick={() => handleDelete(index)}
              >
                {BASIC_INFO.TEXT.DELETE}
              </Button>
            </VStack>
          </Box>
        ))}
        <Button size="sm" variant="outline" alignSelf="flex-start" onClick={handleAdd}>
          {BASIC_INFO.TEXT.ADD_ITEM}
        </Button>
      </VStack>
    </AccordionSection>
  );
}
