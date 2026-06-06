"use client";
import { VStack, Link, Button, Alert } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import TextInputField from "@/component/molecules/field/TextInputField";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { RESET_PASSWORD } from "@/const/pages/RESET_PASSWORD";

export default function ResetPasswordForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();
  const router = useRouter();

  const handleSubmit = async () => {
    clearError();
    if (password !== passwordConfirm) {
      handleError(new Error(RESET_PASSWORD.TEXT.ERROR_PASSWORD_MISMATCH));
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-password", userId, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        handleError(new Error(data.error || RESET_PASSWORD.TEXT.ERROR_DEFAULT));
        return;
      }

      router.push("/login");
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack gap={4} w="full">
      {error && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      )}
      <TextInputField
        label="ユーザーID"
        value={userId}
        onChange={setUserId}
        required
      />
      <TextInputField
        label="新しいパスワード"
        value={password}
        onChange={setPassword}
        type="password"
        required
      />
      <TextInputField
        label="新しいパスワード（確認）"
        value={passwordConfirm}
        onChange={setPasswordConfirm}
        type="password"
        required
      />
      <Button
        colorPalette="blue"
        w="full"
        onClick={handleSubmit}
        loading={isLoading}
        disabled={!userId || !password || !passwordConfirm}
      >
        {RESET_PASSWORD.TEXT.SUBMIT}
      </Button>
      <Link as={NextLink} href="/login" fontSize="sm" color="blue.500">
        {RESET_PASSWORD.TEXT.LINK_LOGIN}
      </Link>
    </VStack>
  );
}
