"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DropdownMenuDemoProps = {
  labels: {
    logout: string;
    profile: string;
    settings: string;
  };
};

export function DropdownMenuDemo({ labels }: DropdownMenuDemoProps) {
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />

      <DropdownMenuContent className="w-65">
        <DropdownMenuItem onClick={handleLogout}>
          {labels.logout}
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/profile" />}>
          {labels.profile}
        </DropdownMenuItem>

        <DropdownMenuItem disabled>{labels.settings}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
