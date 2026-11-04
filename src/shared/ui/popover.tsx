"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "cn";
import { ChevronDownIcon } from "lucide-react";
import { Command, CommandInput, CommandItem, CommandList } from "./command";
function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            // color
            "bg-bg-plain text-text-plain",
            // animation
            "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            // layout
            "z-50 flex origin-(--transform-origin) flex-col gap-2.5",
            // border and shadow
            "ring-foreground/10 rounded-lg shadow-md ring-1 outline-hidden",
            // spacing and typography
            "p-2.5 text-sm",
            // transition
            "duration-100",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 text-sm", className)}
      {...props}
    />
  );
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-text-soft", className)}
      {...props}
    />
  );
}
export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type ComboboxStatus = "idle" | "loading" | "error";

export type ComboboxProps = {
  label?: string;
  /** controlled */
  value?: string;
  /** uncontrolled */
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  options?: ComboboxOption[];
  loadOptions?: (
    query: string,
    signal: AbortSignal,
  ) => Promise<ComboboxOption[]>;
  debounceMs?: number;

  placeholder: string;
  searchPlaceholder: string;
  loadingMessage: string;
  emptyMessage: string;
  errorMessage: string;

  disabled?: boolean;
  id?: string;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
};

const NO_OPTIONS: ComboboxOption[] = [];

function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (v: T) => void,
) {
  const [inner, setInner] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : inner;
  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setInner(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [current, set] as const;
}

function Combobox({
  label,
  value,
  defaultValue = "",
  onValueChange,
  options = NO_OPTIONS,
  loadOptions,
  debounceMs = 300,
  placeholder,
  searchPlaceholder,
  loadingMessage,
  emptyMessage,
  errorMessage,
  disabled,
  id,
  className,
  contentClassName,
  "aria-label": ariaLabel,
}: ComboboxProps) {
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [remote, setRemote] = React.useState<ComboboxOption[]>(NO_OPTIONS);
  const [status, setStatus] = React.useState<ComboboxStatus>("idle");
  const [selectedCache, setSelectedCache] = React.useState<
    ComboboxOption | undefined
  >();

  const isAsync = typeof loadOptions === "function";

  const loadRef = React.useRef(loadOptions);
  React.useEffect(() => {
    loadRef.current = loadOptions;
  });

  const items = React.useMemo(() => {
    if (isAsync) return remote;
    const q = query.trim().toLowerCase();
    return q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
  }, [isAsync, remote, options, query]);

  const selectedOption =
    options.find((o) => o.value === selected) ??
    (selectedCache?.value === selected ? selectedCache : undefined);

  React.useEffect(() => {
    const load = loadRef.current;
    if (!open || !load) return;

    const ctrl = new AbortController();
    setStatus("loading");

    const timer = setTimeout(
      () => {
        load(query, ctrl.signal)
          .then((res) => {
            if (ctrl.signal.aborted) return;
            setRemote(res);
            setStatus("idle");
          })
          .catch(() => {
            if (!ctrl.signal.aborted) setStatus("error");
          });
      },
      query ? debounceMs : 0,
    );

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [open, query, debounceMs, isAsync]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  };

  const handleSelect = (option: ComboboxOption) => {
    if (option.disabled) return;
    setSelectedCache(option);
    setSelected(option.value);
    handleOpenChange(false);
  };

  const showLoading = isAsync && status === "loading";
  const showError = isAsync && status === "error";
  const showEmpty = !showLoading && !showError && items.length === 0;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-text-default text-sm font-medium">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          id={id}
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          data-slot="combobox-trigger"
          className={cn(
            // color
            "bg-bg-plain",
            // layout and spacing
            "flex h-12.25 w-full items-center justify-between gap-2 px-4",
            // border
            "border-border-soft rounded-lg border",
            // typography
            "text-sm font-normal whitespace-nowrap",
            // transitions and focus
            "focus-visible:border-border-primary focus-visible:ring-ring-default transition-colors outline-none focus-visible:ring-3",
            // selection
            "select-none",
            // disabled
            "disabled:cursor-not-allowed disabled:opacity-50",
            // icons
            "[&_svg]:pointer-events-none [&_svg]:shrink-0",
            className,
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-start",
              !selectedOption && "text-text-soft",
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon
            className={cn(
              "text-text-soft size-4 shrink-0 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          data-slot="combobox-content"
          className={cn(
            "w-(--anchor-width) min-w-48 gap-0 overflow-hidden p-0",
            contentClassName,
          )}
        >
          <Command shouldFilter={false} className="p-0">
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={searchPlaceholder}
            />
            <CommandList>
              {showLoading && (
                <div
                  role="status"
                  className="text-text-soft py-6 text-center text-sm"
                >
                  {loadingMessage}
                </div>
              )}
              {showError && (
                <div
                  role="alert"
                  className="text-text-soft py-6 text-center text-sm"
                >
                  {errorMessage}
                </div>
              )}
              {showEmpty && (
                <div
                  role="status"
                  className="text-text-soft py-6 text-center text-sm"
                >
                  {emptyMessage}
                </div>
              )}

              {!showLoading &&
                !showError &&
                items.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    onSelect={() => handleSelect(option)}
                    title={option.label}
                    data-checked={selected === option.value}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {option.label}
                    </span>
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
export {
  Combobox,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
