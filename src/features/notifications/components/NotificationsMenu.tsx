"use client";

import { useState } from "react";
import { BellIcon } from "lucide-react";
import { cn } from "cn";

import { Badge } from "@/shared/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import NotificationsPanel from "./NotificationsPanel";
import { INotificationItem } from "../lib/types/notification";

const ICON_BUTTON =
  "text-foreground hover:text-primary flex size-9 items-center justify-center transition-colors";

export function NotificationsMenu({ label }: { label: string }) {
  const [notifications, setNotifications] = useState<INotificationItem[]>([
    {
      id: "1",
      userId: "u1",
      type: "order",
      title: "Your Order Has Been Shipped",
      message:
        "Your order #12345 has been shipped and will arrive in 2-3 business days.",
      isRead: false,
      link: "/",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      userId: "u1",
      type: "order",
      title: "Your Order Has Been Shipped",
      message: "Your order #12346 has been shipped.",
      isRead: true,
      link: "/",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );

  const deleteOne = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <Popover>
      <PopoverTrigger
        aria-label={label}
        className={cn(ICON_BUTTON, "relative")}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <Badge className="absolute -inset-e-1 -top-1 h-4 px-1 text-[10px]">
            {unreadCount}
          </Badge>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="border-0 bg-transparent p-0 shadow-none"
      >
        <NotificationsPanel
          notifications={notifications}
          onClearAll={() => setNotifications([])}
          onMarkAllAsRead={markAllAsRead}
          onMarkAsRead={markAsRead}
          onDelete={deleteOne}
        />
      </PopoverContent>
    </Popover>
  );
}
