import { useState } from "react";

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("予期しないエラーが発生しました");
    }
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
};
