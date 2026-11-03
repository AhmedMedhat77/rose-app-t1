"use client";

import { useState } from "react";
import { BellIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotificationsPanel, { NotificationItem } from "./notifications-pannel";

const ICON_BUTTON =
  "text-foreground hover:text-primary flex size-9 items-center justify-center  transition-colors";

export function NotificationsMenu({ label }: { label: string }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  return (
    <Popover>
      <PopoverTrigger aria-label={label} className={ICON_BUTTON}>
        <BellIcon />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="min-h-56 w-full max-w-84 border-0 bg-transparent p-0 shadow-none"
      >
        <NotificationsPanel
          notifications={notifications}
          onClearAll={() => setNotifications([])}
          onMarkAllAsRead={() =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
          }
        />
      </PopoverContent>
    </Popover>
  );
}
