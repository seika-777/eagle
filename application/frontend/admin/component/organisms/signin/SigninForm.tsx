"use client";
import { VStack, Link, Button, Alert } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import TextInputField from "@/component/molecules/field/TextInputField";
import { SIGNIN } from "@/const/pages/SIGNIN";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export default function SigninForm() {
  const [signupCode, setSignupCode] = useState("");
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { error, handleError, clearError } = useErrorHandler();
  const router = useRouter();

  const handleSubmit = async () => {
    clearError();
    if (password !== passwordConfirm) {
      handleError(new Error(SIGNIN.TEXT.ERROR_PASSWORD_MISMATCH));
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", signupCode, userId, displayName, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        handleError(new Error(data.error || SIGNIN.TEXT.ERROR_DEFAULT));
        return;
      }

      setSuccessMessage(SIGNIN.TEXT.SUCCESS);
      setTimeout(() => router.push("/login"), 1500);
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
      {successMessage && (
        <Alert.Root status="success">
          <Alert.Indicator />
          <Alert.Description>{successMessage}</Alert.Description>
        </Alert.Root>
      )}
      <TextInputField
        label="登録コード"
        value={signupCode}
        onChange={setSignupCode}
        type="password"
        required
      />
      <TextInputField
        label="ユーザーID"
        value={userId}
        onChange={setUserId}
        required
        placeholder={String(SIGNIN.TEXT.USER_ID_HINT)}
      />
      <TextInputField
        label="ユーザー名"
        value={displayName}
        onChange={setDisplayName}
        required
      />
      <TextInputField
        label="パスワード"
        value={password}
        onChange={setPassword}
        type="password"
        required
      />
      <TextInputField
        label="パスワード（確認）"
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
        disabled={!signupCode || !userId || !displayName || !password || !passwordConfirm}
      >
        {SIGNIN.TEXT.SUBMIT}
      </Button>
      <Link as={NextLink} href="/login" fontSize="sm" color="blue.500">
        {SIGNIN.TEXT.LINK_LOGIN}
      </Link>
    </VStack>
  );
}
