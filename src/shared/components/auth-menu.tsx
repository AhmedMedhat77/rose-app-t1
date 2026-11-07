"use client";

import { useSession } from "next-auth/react";
import UserDropdown from "./userdropdown";
import LoginPopover from "@/features/auth/components/login-popover";

export default function AuthMenu({ loginLabel }: { loginLabel: string }) {
  const { data: session, status } = useSession();

  // نحجز مكان بنفس الحجم، عشان الـ Header ما يقفزش وما يظهرش "Login" لحظة
  if (status === "loading") {
    return (
      <div
        aria-hidden="true"
        className="bg-muted h-12 w-36 animate-pulse rounded-md"
      />
    );
  }

  if (session?.user) {
    return <UserDropdown />;
  }

  return <LoginPopover label={loginLabel} />;
}
