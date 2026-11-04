"use client";
import { useTranslations } from "next-intl";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  parseTheme,
  themeModes,
  useTheme,
} from "@/shared/context/theme.context";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import { cn } from "cn";

const icons = {
  light: Sun,
  system: Monitor,
  dark: Moon,
} as const;

export function ThemeMode() {
  const t = useTranslations("theme");
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      aria-label={t("label")}
      value={[theme]}
      onValueChange={(value) => {
        const next = value[0];
        if (next) setTheme(parseTheme(next));
      }}
      className={cn(
        "inline-flex h-10 w-27 items-center gap-0",
        "border-border-soft bg-bg-plain rounded-full border p-0.75",
      )}
    >
      {themeModes.map((mode) => {
        const Icon = icons[mode];

        return (
          <ToggleGroupItem
            key={mode}
            value={mode}
            aria-label={t(mode)}
            title={t(mode)}
            className={cn(
              "text-text-plain size-8.5 min-w-0 flex-1 rounded-full px-0",
              "hover:bg-transparent",
              "focus-visible:ring-ring focus-visible:ring-2",
              "focus-visible:ring-offset-background focus-visible:ring-offset-1",
              "data-pressed:bg-bg-soft dark:data-pressed:bg-bg-muted data-pressed:shadow-sm",
            )}
          >
            <Icon
              aria-hidden="true"
              className="size-4.5 shrink-0"
              strokeWidth={2}
            />
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
