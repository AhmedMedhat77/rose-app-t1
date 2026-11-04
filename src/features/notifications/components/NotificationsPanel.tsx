"use client";

import {
  BellOff,
  BrushCleaning,
  Check,
  CheckCheck,
  EllipsisVertical,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { cn } from "cn";
import { INotificationItem } from "../lib/types/notification";

interface NotificationsPanelProps {
  notifications?: INotificationItem[];
  onClearAll?: () => void;
  onMarkAllAsRead?: () => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const actionClass =
  "h-auto gap-2 px-1 py-1   text-text-muted hover:bg-transparent hover:text-zinc-600";

export default function NotificationsPanel({
  notifications = [],
  onClearAll,
  onMarkAllAsRead,
  onMarkAsRead,
  onDelete,
  className,
}: NotificationsPanelProps) {
  const t = useTranslations("NotificationsPanel");
  const isEmpty = notifications.length === 0;

  return (
    <Card
      aria-label="Notifications"
      className={cn(
        "flex flex-col gap-0 overflow-hidden border-0 bg-white p-0 shadow-2xl",
        className,
      )}
    >
      {/* Header */}
      <header className="bg-maroon-700 px-4 py-4">
        <h2 className="text-xl leading-tight font-bold text-white">
          {t("title")}
          {!isEmpty && ` (${notifications.length})`}
        </h2>
      </header>

      {/* Actions */}
      <div className="flex items-center justify-between border-b border-white px-5 py-3">
        <Button variant="ghost" className={actionClass} onClick={onClearAll}>
          <BrushCleaning />
          {t("clearAll")}
        </Button>

        <Button
          variant="ghost"
          className={actionClass}
          onClick={onMarkAllAsRead}
        >
          <CheckCheck />
          {t("markAllAsRead")}
        </Button>
      </div>

      {/* Body */}
      <div
        className={cn(
          "flex flex-1 flex-col items-center",
          isEmpty ? "justify-center gap-4 p-6" : "max-h-80 overflow-y-auto",
        )}
      >
        {isEmpty ? (
          <>
            <BellOff className="text-text-soft size-20" strokeWidth={1.25} />
            <p className="text-text-soft text-xl">{t("empty")}</p>
          </>
        ) : (
          <ul className="w-full">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "flex items-start gap-2 border-b border-white px-4 py-3",
                  n.isRead && "bg-zinc-300",
                )}
              >
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-sm",
                      n.isRead ? "text-text-soft font-normal" : "font-bold",
                    )}
                  >
                    {n.title}
                  </p>
                  <p className="text-text-soft line-clamp-2 text-xs">
                    {n.message}
                  </p>
                </div>

                <Popover>
                  <PopoverTrigger
                    aria-label="Notification options"
                    className="text-text-soft hover:text-zinc-700"
                  >
                    <EllipsisVertical className="size-4" />
                  </PopoverTrigger>
                  <PopoverContent align="end" className="gap-1 p-1">
                    <button
                      type="button"
                      disabled={n.isRead}
                      onClick={() => onMarkAsRead?.(n.id)}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-400 disabled:hover:bg-transparent"
                    >
                      <Check className="size-4" />
                      {t("markAsRead")}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(n.id)}
                      className="text-text-danger flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100"
                    >
                      <Trash2 className="size-4" />
                      {t("delete")}
                    </button>
                  </PopoverContent>
                </Popover>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
