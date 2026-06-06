import { notFound } from "next/navigation";
import { configMap } from "@/const/config/index";
import ItemListTemplate from "@/component/templates/ItemListTemplate";

type Props = {
  params: Promise<{ type: string }>;
};

export default async function ItemListPage({ params }: Props) {
  const { type } = await params;
  if (!configMap[type]) notFound();
  return <ItemListTemplate type={type} />;
}
