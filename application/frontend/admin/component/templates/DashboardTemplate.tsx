"use client";
import { Box, Text } from "@chakra-ui/react";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import DashboardCardGrid from "@/component/organisms/dashboard/DashboardCardGrid";
import { DASHBOARD } from "@/const/pages/DASHBOARD";
import { useUser } from "@/app/UserContext";

export default function DashboardTemplate() {
  const { user } = useUser();

  return (
    <AdminLayoutTemplate title={DASHBOARD.TEXT.TITLE}>
      <Box mb={4}>
        <Text color="gray.600">{DASHBOARD.TEXT.WELCOME}</Text>
      </Box>
      {user?.role === "admin" ? (
        <DashboardCardGrid />
      ) : (
        <Text>{DASHBOARD.TEXT.COMMON_MESSAGE}</Text>
      )}
    </AdminLayoutTemplate>
  );
}
