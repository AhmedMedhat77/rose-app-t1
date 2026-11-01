import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const badgeVariants = cva(
  [
    // flex
    "group/badge inline-flex gap-2.5 h-4 w-fit shrink-0 items-center justify-center  overflow-hidden",
    // border and padding
    "rounded-full border border-transparent px-2 py-2",
    // text
    "text-xs  font-medium  whitespace-nowrap",
    // transition focus outline
    "transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  ],
  {
    variants: {
      variant: {
        primary: [
          // color
          "bg-bg-primary text-text-inverse",
          // hover
          "hover:bg-bg-primary-saturated",
        ],
        secondary: [
          // color
          "bg-bg-secondary-faint text-text-primary",
          // hover
          "hover:bg-bg-secondary-fade",
        ],
        subtle: [
          // color
          "bg-bg-soft text-text-plain",
          //  hover
          "hover:bg-bg-muted",
        ],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

function Badge({
  className,
  variant = "primary",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
