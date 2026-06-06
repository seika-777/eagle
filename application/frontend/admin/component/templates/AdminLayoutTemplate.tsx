"use client";
import { Box, Flex } from "@chakra-ui/react";
import { ReactNode, useState, useEffect } from "react";
import Sidebar from "@/component/organisms/layout/Sidebar";
import SidebarDrawer from "@/component/organisms/layout/SidebarDrawer";
import Header from "@/component/organisms/layout/Header";
import { useUser } from "@/app/UserContext";
import { supabase } from "@/lib/supabase";
import type { UserRoleType } from "@/const/type/auth/UserRoleType";

type Props = {
  children: ReactNode;
  title: string;
};

export default function AdminLayoutTemplate({ children, title }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setUser } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("user_meta")
        .select("id, user_id, display_name, role, is_editable, created_at")
        .eq("id", user.id)
        .single();
      if (data) {
        setUser({
          id: data.id,
          userId: data.user_id,
          displayName: data.display_name,
          role: data.role as UserRoleType,
          isEditable: data.is_editable,
          createdAt: data.created_at,
        });
      }
    };
    fetchUser();
  }, []);

  return (
    <Flex minH="100vh">
      <Box display={{ base: "none", md: "flex" }}>
        <Sidebar />
      </Box>
      <SidebarDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Flex flex={1} direction="column" overflow="hidden">
        <Header title={title} onMenuClick={() => setDrawerOpen(true)} />
        <Box as="main" flex={1} p={6} bg="gray.50" overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
