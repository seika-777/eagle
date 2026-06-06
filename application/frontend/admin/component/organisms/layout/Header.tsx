"use client";
import { Box, Flex, Text, Button, IconButton } from "@chakra-ui/react";
import { RiMenu2Line } from "react-icons/ri";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/app/UserContext";

type Props = {
  title: string;
  onMenuClick?: () => void;
};

export default function Header({ title, onMenuClick }: Props) {
  const { setUser } = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <Box as="header" bg="white" borderBottomWidth="1px" px={4} py={3}>
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={3}>
          {onMenuClick && (
            <IconButton
              aria-label="メニューを開く"
              variant="ghost"
              onClick={onMenuClick}
              display={{ base: "flex", md: "none" }}
            >
              <RiMenu2Line />
            </IconButton>
          )}
          <Text fontWeight="bold" fontSize="lg">{title}</Text>
        </Flex>
        <Button size="sm" variant="outline" onClick={handleLogout}>
          ログアウト
        </Button>
      </Flex>
    </Box>
  );
}
