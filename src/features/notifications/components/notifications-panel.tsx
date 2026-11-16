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
  "h-auto gap-2 px-1 py-1 dark:text-zinc-50 dark:hover:text-text-muted hover:bg-transparent hover:text-zinc-600";

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
        "bg-bg-plain flex flex-col gap-0 overflow-hidden border-0 p-0 shadow-2xl",
        className,
      )}
    >
      {/* Header */}
      <header className="bg-bg-primary-saturated px-4 py-4">
        <h2 className="text-text-inverse text-xl leading-tight font-bold">
          {t("title")}
          {!isEmpty && ` (${notifications.length})`}
        </h2>
      </header>

      {/* Actions */}
      <div className="border-border-inverse flex items-center justify-between border-b px-5 py-3">
        <Button variant="ghost" className={actionClass} onClick={onClearAll}>
          <BrushCleaning className="text-zinc-400" size={18} />
          {t("clearAll")}
        </Button>

        <Button
          variant="ghost"
          className={actionClass}
          onClick={onMarkAllAsRead}
        >
          <CheckCheck className="text-zinc-400" size={18} />
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
                  "border-border-inverse flex items-start gap-2 border-b px-4 py-3",
                  n.isRead
                    ? "bg-zinc-300 dark:bg-zinc-600"
                    : "dark:bg-bg-muted",
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
                    <EllipsisVertical className="size-4 cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent align="end" className="gap-1 p-1">
                    <button
                      type="button"
                      disabled={n.isRead}
                      onClick={() => onMarkAsRead?.(n.id)}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm disabled:cursor-not-allowed disabled:text-zinc-400 disabled:hover:bg-transparent"
                    >
                      <Check className="size-4" />
                      {t("markAsRead")}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(n.id)}
                      className="text-text-danger flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm"
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
