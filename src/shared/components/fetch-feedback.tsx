import React from "react";

export default function FetchFeedback({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <p className="text-text-danger my-4 text-center text-sm">{children}</p>
  );
}
