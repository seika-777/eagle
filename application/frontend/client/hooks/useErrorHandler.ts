import { useState, useCallback } from "react";
import type { ErrorType } from "@/const/type/error/ErrorType";

export const useErrorHandler = () => {
  const [errorAlertDescription, setErrorAlertDescription] = useState("");

  const handleError = useCallback((error: ErrorType) => {
    const message = error?.body?.detail || "";
    setErrorAlertDescription(message);
  }, []);

  const resetError = useCallback(() => {
    setErrorAlertDescription("");
  }, []);

  return { errorAlertDescription, handleError, resetError };
};
