"use client";
import { useState, useEffect } from "react";
import { Box, Text, Link, Button, Alert } from "@chakra-ui/react";
import AdminLayoutTemplate from "@/component/templates/AdminLayoutTemplate";
import DashboardCardGrid from "@/component/organisms/dashboard/DashboardCardGrid";
import { DASHBOARD } from "@/const/pages/DASHBOARD";
import { useUser } from "@/app/UserContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { supabase } from "@/lib/supabase";

export default function DashboardTemplate() {
  const { user } = useUser();
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildSuccess, setBuildSuccess] = useState(false);
  const [lastDeployedAt, setLastDeployedAt] = useState<string | null>(null);
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    const fetchLastDeployedAt = async () => {
      const { data } = await supabase
        .from("options")
        .select("value")
        .eq("key", "last_deployed_at")
        .single();
      if (data?.value) setLastDeployedAt(data.value);
    };
    fetchLastDeployedAt();
  }, []);

  const handleBuild = async () => {
    clearError();
    setBuildSuccess(false);
    setIsBuilding(true);
    try {
      const res = await fetch("/api/deploy", { method: "POST" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({ error: "" }))) as { error: string };
        throw new Error(body.error || "ビルドに失敗しました");
      }
      const now = new Date().toISOString();
      setLastDeployedAt(now);
      setBuildSuccess(true);
    } catch (err) {
      handleError(err);
    } finally {
      setIsBuilding(false);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
      {user?.role === "admin" && (
        <Box mb={6}>
          {error && (
            <Alert.Root status="error" mb={3}>
              <Alert.Indicator />
              <Alert.Description>{error}</Alert.Description>
            </Alert.Root>
          )}
          {buildSuccess && (
            <Alert.Root status="success" mb={3}>
              <Alert.Indicator />
              <Alert.Description>ビルドを開始しました</Alert.Description>
            </Alert.Root>
          )}
          <Button colorPalette="green" onClick={handleBuild} loading={isBuilding}>
            変更を反映
          </Button>
          {lastDeployedAt && (
            <Text mt={2} fontSize="sm" color="gray.500">
              最終反映日時: {formatDate(lastDeployedAt)}
            </Text>
          )}
        </Box>
      )}
      {user?.role === "admin" ? <DashboardCardGrid /> : <Text>{DASHBOARD.TEXT.COMMON_MESSAGE}</Text>}
    </AdminLayoutTemplate>
  );
}
