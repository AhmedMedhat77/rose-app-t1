"use client";

import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "cn";
import { ChevronRightIcon } from "lucide-react";

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal keepMounted>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            // color
            "bg-bg-plain text-text-plain",
            // shadow and border color
            "shadow-shadow-subtle border-border-muted ring-foreground/10",
            // side positioning animations
            "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            // open and close transitions
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            // positioning, sizing, and overflow
            "z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto",
            // border and shape
            "rounded-lg border",
            // typography
            "text-sm",
            // ring, outline, and closed overflow
            "ring-1 duration-100 outline-none data-closed:overflow-hidden",
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "text-text-soft px-1.5 py-1 text-xs font-medium data-inset:ps-7",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        // group
        "group/dropdown-menu-item",
        // color
        "data-selected:text-text-primary hover:text-text-plain data-highlighted:text-text-plain not-data-[variant=destructive]:hover:**:text-text-primary data-[variant=destructive]:text-text-danger data-[variant=destructive]:focus:text-text-danger data-[variant=destructive]:*:[svg]:text-text-danger",
        // selected colors
        "data-checked:bg-bg-muted data-checked:text-text-primary",
        // background
        "data-selected:bg-bg-muted hover:bg-bg-muted data-highlighted:bg-bg-muted data-[variant=destructive]:focus:bg-bg-danger/10 dark:data-[variant=destructive]:focus:bg-bg-danger/20",
        // layout
        "relative flex items-center",
        // spacing
        "gap-2.5 p-4 data-inset:ps-7",
        // typography
        "text-sm data-selected:font-medium",
        // interaction
        "cursor-default outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50",
        // svg
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        // focus
        "focus:bg-bg-primary-fade focus:text-text-primary not-data-[variant=destructive]:focus:**:text-text-primary",
        // selected
        "data-popup-open:bg-bg-primary-fade data-popup-open:text-text-primary",
        // active
        "data-open:bg-bg-primary-fade data-open:text-text-primary",
        // layout
        "flex cursor-default items-center gap-1.5",
        // border
        "rounded-md outline-hidden",
        // spacing
        "px-1.5 py-1 data-inset:ps-7",
        // typography
        "text-sm select-none",
        // icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        // color
        "bg-bg-plain text-text-plain ring-foreground/10",
        // transitions
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 duration-100",
        // layout
        "w-auto min-w-24",
        // border
        "rounded-lg ring-1",
        // spacing
        "p-1",
        // shadow
        "shadow-lg",
        className,
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        // layout
        "relative flex cursor-default items-center rounded-none! shadow-none",

        // spacing
        "gap-2.5 p-4 data-inset:ps-7",

        // typography
        "text-sm",

        // interaction

        "data-disabled:pointer-events-none data-disabled:opacity-50",
        // hover, focus and highlighted
        "hover:bg-bg-muted hover:text-text-plain",
        "data-highlighted:bg-bg-muted data-highlighted:text-text-plain",

        // checked state
        "data-checked:bg-bg-muted data-checked:text-text-primary data-checked:font-medium",

        // checkbox-specific state
        "data-checked:**:text-text-primary",

        // icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

        className,
      )}
      checked={checked}
      {...props}
    >
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.RadioItem
      closeOnClick
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        // selected colors
        "data-checked:bg-bg-muted data-checked:text-text-primary",
        // hover
        "hover:bg-bg-muted hover:text-text-plain hover:**:text-text-primary data-highlighted:bg-bg-muted data-highlighted:text-text-plain",
        // layout
        "relative flex cursor-default items-center gap-2.5",
        // spacing
        "p-4 data-inset:ps-7",
        // typography
        "text-sm",
        // focus
        "outline-hidden",
        // selected
        "data-checked:font-medium",
        // disabled
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        // icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        // color
        "text-text-soft",
        // focus
        "group-focus/dropdown-menu-item:text-text-primary",
        // spacing
        "ms-auto",
        // typography
        "text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
