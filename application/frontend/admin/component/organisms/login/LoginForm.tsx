"use client";
import { VStack, Link, Button, Alert } from "@chakra-ui/react";
import { useState } from "react";
import NextLink from "next/link";
import TextInputField from "@/component/molecules/field/TextInputField";
import { LOGIN } from "@/const/pages/LOGIN";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export default function LoginForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  const handleSubmit = async () => {
    clearError();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", userId, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        handleError(new Error(data.error || LOGIN.TEXT.ERROR_INVALID));
        return;
      }

      window.location.href = "/";
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
        label="パスワード"
        value={password}
        onChange={setPassword}
        type="password"
        required
      />
      <Button
        colorPalette="blue"
        w="full"
        onClick={handleSubmit}
        loading={isLoading}
        disabled={!userId || !password}
      >
        {LOGIN.TEXT.SUBMIT}
      </Button>
      <Link as={NextLink} href="/signin" fontSize="sm" color="blue.500">
        {LOGIN.TEXT.LINK_SIGNIN}
      </Link>
      <Link as={NextLink} href="/reset-password" fontSize="sm" color="blue.500">
        {LOGIN.TEXT.LINK_RESET}
      </Link>
    </VStack>
  );
}
