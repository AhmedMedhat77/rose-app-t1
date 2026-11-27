import { cn } from "cn";
import React from "react";

interface FetchFeedbackProps {
  children: React.ReactNode;
  className?: string;
}

export default function FetchFeedback({
  children,
  className,
}: FetchFeedbackProps) {
  if (!children) return null;

  return (
    <p className={cn("text-text-danger my-4 text-center text-sm", className)}>
      {children}
    </p>
  );
}
