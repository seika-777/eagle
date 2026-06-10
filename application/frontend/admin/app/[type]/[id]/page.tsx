"use client";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { configMap } from "@/const/config/index";
import ItemEditTemplate from "@/component/templates/ItemEditTemplate";
import { getItems } from "@/const/function/getItems";

type Props = {
  params: Promise<{ type: string; id: string }>;
};

export default function ItemEditPage({ params }: Props) {
  const { type, id } = use(params);
  const config = configMap[type];

  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, readonly { label: string; value: string | number }[]>
  >({});

  useEffect(() => {
    if (!config) return;

    type NamedItem = { id: number; name: string };

    const loadDynamicOptions = async () => {
      if (type === "regulation") {
        const [gods, schools, races, supplements] = await Promise.all([
          getItems<NamedItem>("god", { is_always: "false" }),
          getItems<NamedItem>("school", { is_always: "false" }),
          getItems<NamedItem>("race", { is_always: "false" }),
          getItems<NamedItem>("supplement", { is_always: "false" }),
        ]);
        setDynamicOptions({
          godIds: gods.map((g) => ({ label: g.name, value: g.id })),
          schoolIds: schools.map((s) => ({ label: s.name, value: s.id })),
          raceIds: races.map((r) => ({ label: r.name, value: r.id })),
          supplementIds: supplements.map((s) => ({ label: s.name, value: s.id })),
        });
      }

      if (type === "house-rule") {
        const supplements = await getItems<NamedItem>("supplement");
        setDynamicOptions({
          supplementId: [
            { label: "なし", value: "" },
            ...supplements.map((s) => ({ label: s.name, value: s.id })),
          ],
        });
      }

      if (type === "stage-term") {
        const regulations = await getItems<NamedItem>("regulation");
        setDynamicOptions({
          regulationIds: regulations.map((r) => ({ label: r.name, value: r.id })),
        });
      }
    };

    loadDynamicOptions();
  }, [type]);

  if (!config) notFound();

  return (
    <ItemEditTemplate
      type={type}
      id={id}
      dynamicOptions={Object.keys(dynamicOptions).length > 0 ? dynamicOptions : undefined}
    />
  );
}
