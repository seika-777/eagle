"use client";
import { Box, Heading, Button, HStack, Alert, Separator, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import AccordionSection from "@/component/molecules/AccordionSection";
import ItemForm from "@/component/organisms/ItemForm";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { basicInfoConfig } from "@/const/config/basicInfo";
import { getOptions } from "@/const/function/getOptions";
import { updateOptions } from "@/const/function/updateOptions";
import { BASIC_INFO } from "@/const/pages/BASIC_INFO";
import type { FormRecord } from "@/const/type/config/EntityConfigType";

export default function BasicInfoTemplate() {
  const [form, setForm] = useState<FormRecord>(basicInfoConfig.initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await getOptions();
        setForm(basicInfoConfig.toForm(data));
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (key: string, value: FormRecord[string]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    clearError();
    setIsSaved(false);
    setIsSaving(true);
    try {
      await updateOptions(basicInfoConfig.toBody(form));
      setIsSaved(true);
    } catch (err) {
      handleError(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayoutTemplate title={BASIC_INFO.TEXT.TITLE}>
      <Heading size="md" mb={4}>{BASIC_INFO.TEXT.TITLE}</Heading>
      <Box bg="white" borderRadius="md" shadow="sm" p={6}>
        {error && (
          <Alert.Root status="error" mb={4}>
            <Alert.Indicator />
            <Alert.Description>{error}</Alert.Description>
          </Alert.Root>
        )}
        {isSaved && (
          <Alert.Root status="success" mb={4}>
            <Alert.Indicator />
            <Alert.Description>{BASIC_INFO.TEXT.SAVED}</Alert.Description>
          </Alert.Root>
        )}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {basicInfoConfig.formSections.map((section) => (
              <AccordionSection key={section.title} title={section.title}>
                <ItemForm formItems={section.items} form={form} onChange={handleChange} />
              </AccordionSection>
            ))}
            <Separator mt={8} mb={4} />
            <HStack justify="flex-end">
              <Button colorPalette="blue" onClick={handleSave} loading={isSaving}>
                {BASIC_INFO.TEXT.SAVE}
              </Button>
            </HStack>
          </>
        )}
      </Box>
    </AdminLayoutTemplate>
  );
}
