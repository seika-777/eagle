"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { VStack, Alert } from "@chakra-ui/react";
import AppButton from "@/component/atoms/AppButton";
import TextInputField from "@/component/molecules/field/TextInputField";
import { LOGIN } from "@/const/pages/LOGIN";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import type { UserRoleType } from "@/const/type/auth/UserRoleType";

export default function LoginForm() {
  const router = useRouter();
  const { errorAlertDescription, handleError, resetError } = useErrorHandler();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordMinLength = Number(LOGIN.VALUE.PASSWORD_MIN_LENGTH);
  const isSubmitDisabled =
    userId === "" || password === "" || password.length < passwordMinLength;

  const showError = (message: string) => {
    handleError({ body: { detail: message }, status: 0 });
  };

  const handleSubmit = async () => {
    resetError();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", userId, password }),
      });

      if (!res.ok) {
        showError(LOGIN.TEXT.ERROR_INVALID);
        return;
      }

      const data = (await res.json()) as { role: UserRoleType | null };
      // 成功 role が general/admin → /mypage（オープンリダイレクト予防のため内部固定パスのリテラルのみ）。
      if (data.role === "general" || data.role === "admin") {
        router.push("/mypage");
        return;
      }

      // 成功 role が common → 留まって権限なしエラーを表示。
      showError(LOGIN.TEXT.ERROR_NO_PERMISSION);
    } catch {
      showError(LOGIN.TEXT.ERROR_INVALID);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack gap={4} w="full">
      {errorAlertDescription !== "" && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Description>{errorAlertDescription}</Alert.Description>
        </Alert.Root>
      )}
      <TextInputField
        label={LOGIN.TEXT.USER_ID_LABEL}
        value={userId}
        onChange={setUserId}
        required
      />
      <TextInputField
        label={LOGIN.TEXT.PASSWORD_LABEL}
        value={password}
        onChange={setPassword}
        type="password"
        required
      />
      <AppButton
        variant="primary"
        fullWidth
        onClick={handleSubmit}
        loading={isLoading}
        disabled={isSubmitDisabled}
      >
        {LOGIN.TEXT.SUBMIT}
      </AppButton>
    </VStack>
  );
}
