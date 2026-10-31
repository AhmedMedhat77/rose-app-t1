"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "cn";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("group/tabs flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "group/tabs-list text-muted-foreground inline-flex h-11 w-fit items-center justify-center",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-full flex-1 items-center justify-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-all disabled:pointer-events-none has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "rounded-none first:rounded-s-lg last:rounded-e-lg",
        "border-border-soft bg-bg-plain text-text-plain border first:border-e-0 last:border-s-0",
        // Hovered, Focused, Disabled, and Active states styles
        "data-active:bg-bg-primary data-active:text-text-inverse data-active:border-transparent",
        "data-active:hover:bg-bg-primary-saturated",
        "data-active:focus-visible:ring-ring-default z-[1] data-active:focus-visible:z-0 data-active:focus-visible:ring-2",
        "data-active:focus-visible:outline-none",
        "data-disabled:data-active:bg-bg-muted data-disabled:data-active:text-text-muted",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
