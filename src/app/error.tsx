"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ui/ErrorState";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      variant="server"
      onRetry={reset}
      detail={error.digest ? `Ref: ${error.digest}` : undefined}
    />
  );
}
