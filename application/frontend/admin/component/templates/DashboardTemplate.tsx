"use client";
import { Box, Text, Link } from "@chakra-ui/react";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import DashboardCardGrid from "@/component/organisms/dashboard/DashboardCardGrid";
import { DASHBOARD } from "@/const/pages/DASHBOARD";
import { useUser } from "@/app/UserContext";

export default function DashboardTemplate() {
  const { user } = useUser();
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;

  return (
    <AdminLayoutTemplate title={DASHBOARD.TEXT.TITLE}>
      <Box mb={4}>
        <Text color="gray.600">{DASHBOARD.TEXT.WELCOME}</Text>
      </Box>
      {clientUrl && (
        <Box mb={6}>
          <Link
            href={clientUrl}
            target="_blank"
            rel="noopener noreferrer"
            px={4}
            py={2}
            borderRadius="md"
            border="1px solid"
            borderColor="blue.500"
            color="blue.500"
            fontSize="sm"
            _hover={{ bg: "blue.50", textDecoration: "none" }}
          >
            閲覧サイトを開く
          </Link>
        </Box>
      )}
      {user?.role === "admin" ? (
        <DashboardCardGrid />
      ) : (
        <Text>{DASHBOARD.TEXT.COMMON_MESSAGE}</Text>
      )}
    </AdminLayoutTemplate>
  );
}
