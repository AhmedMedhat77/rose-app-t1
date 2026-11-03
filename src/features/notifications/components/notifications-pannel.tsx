"use client";

import { BellOff, BrushCleaning, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { Card } from "@/components/ui/card";

export interface NotificationItem {
  id: string;
  title: string;
  read: boolean;
}

interface NotificationsPanelProps {
  notifications?: NotificationItem[];
  onClearAll?: () => void;
  onMarkAllAsRead?: () => void;
  className?: string;
}

const actionClass =
  "h-auto gap-2 px-1 py-1 text-lg font-medium text-zinc-400 hover:bg-transparent hover:text-zinc-600 [&_svg]:size-7";

export default function NotificationsPanel({
  notifications = [],
  onClearAll,
  onMarkAllAsRead,
  className,
}: NotificationsPanelProps) {
  const isEmpty = notifications.length === 0;

  return (
    <Card
      aria-label="Notifications"
      className={cn(
        "flex min-h-56 w-full max-w-84 flex-col gap-0 overflow-hidden border-0 bg-white p-0 shadow-2xl",
        className,
      )}
    >
      {/* Header */}
      <header className="bg-maroon-700 min-h-13 max-w-84 px-4 py-4">
        <h2 className="text-xl leading-tight font-bold text-white">
          Notifications
        </h2>
      </header>

      {/* Actions */}
      <div className="flex items-center justify-between border-b border-[#d9dadd] px-5 py-3">
        <Button variant="ghost" className={actionClass} onClick={onClearAll}>
          <BrushCleaning />
          Clear all notifications
        </Button>

        <Button
          variant="ghost"
          className={actionClass}
          onClick={onMarkAllAsRead}
        >
          <CheckCheck />
          Mark all as read
        </Button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        {isEmpty ? (
          <>
            <BellOff className="size-20 text-[#6b6f76]" strokeWidth={1.25} />
            <p className="text-xl text-[#6b6f76]">
              No notifications to display.
            </p>
          </>
        ) : (
          <ul className="w-full">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "border-b border-[#d9dadd] py-3",
                  n.read ? "font-normal" : "font-bold",
                )}
              >
                {n.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
