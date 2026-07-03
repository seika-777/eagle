"use client";
import { Box, VStack, Text, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/UserContext";

const MENU_ITEMS = [
  { label: "ダッシュボード", href: "/", adminOnly: false },
  { label: "レギュレーション管理", href: "/regulation", adminOnly: true },
  { label: "神格管理", href: "/god", adminOnly: true },
  { label: "流派管理", href: "/school", adminOnly: true },
  { label: "種族管理", href: "/race", adminOnly: true },
  { label: "ハウスルール管理", href: "/house-rule", adminOnly: true },
  { label: "禁止事項管理", href: "/prohibition", adminOnly: true },
  { label: "サプリメント管理", href: "/supplement", adminOnly: true },
  { label: "オリジナルアイテム管理", href: "/original", adminOnly: true },
  { label: "語録管理", href: "/word", adminOnly: true },
  { label: "舞台/用語管理", href: "/stage-term", adminOnly: true },
  { label: "ロール管理", href: "/user-role", adminOnly: true },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  const visibleItems = MENU_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <Box as="nav" w="240px" minH="100vh" bg="gray.800" color="white" p={4}>
      <Text fontWeight="bold" fontSize="lg" mb={6} whiteSpace="pre-line">
        {"隻翼の大鷲亭\n管理画面"}
      </Text>
      <VStack align="stretch" gap={1}>
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            as={NextLink}
            href={item.href}
            px={3}
            py={2}
            borderRadius="md"
            textDecoration="none"
            bg={pathname === item.href ? "blue.600" : "transparent"}
            _hover={{ bg: pathname === item.href ? "blue.600" : "gray.700" }}
            color="white"
            fontSize="sm"
          >
            {item.label}
          </Link>
        ))}
      </VStack>
    </Box>
  );
}
