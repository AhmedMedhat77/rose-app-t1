"use client";
import { useTheme } from "@/shared/context/theme.context";
import { cn } from "cn";
import Image, { type ImageProps } from "next/image";

type IProps = Partial<ImageProps>;

export default function FormDecorative(props?: IProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <Image
      src={`/images/separator-${isDark ? "1" : "2"}.png`}
      alt="decorative separator"
      width={260}
      height={42}
      className={cn("h-auto w-60 object-contain sm:w-65", props?.className)}
      priority
      {...props}
    />
  );
}
