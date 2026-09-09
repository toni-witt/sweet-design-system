"use client";

import { type ComponentProps } from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { tv, type VariantProps } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"

const popoverVariants = tv({
  base: [
    "z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ],
})

type PopoverProps = ComponentProps<typeof PopoverPrimitive.Root>
const Popover = ({ ...props }: PopoverProps) => (
  <PopoverPrimitive.Root
    data-tag={casing.kebabCase(Popover.displayName)}
    {...props}
  />
)

type PopoverContentProps =
  ComponentProps<typeof PopoverPrimitive.Content> &
  VariantProps<typeof popoverVariants>

/**
 * - By default, the popover content will be rendered into <body> (ie., due to <Portal>)
 */
const PopoverContent = ({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: PopoverContentProps) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      data-tag={casing.kebabCase(PopoverContent.displayName)}
      className={popoverVariants({ className })}
      {...props}
    />
  </PopoverPrimitive.Portal>
)

type PopoverTriggerProps = ComponentProps<typeof PopoverPrimitive.Trigger>
const PopoverTrigger = ({ ...props }: PopoverTriggerProps) => (
  <PopoverPrimitive.Trigger
    data-tag={casing.kebabCase(PopoverTrigger.displayName)}
    {...props}
  />
)

type PopoverAnchorProps = ComponentProps<typeof PopoverPrimitive.Anchor>
const PopoverAnchor = ({ ...props }: PopoverAnchorProps) => (
  <PopoverPrimitive.Anchor
    data-tag={casing.kebabCase(PopoverAnchor.displayName)}
    {...props}
  />
)

Popover.displayName = 'Popover';
PopoverTrigger.displayName = 'PopoverTrigger';
PopoverContent.displayName = 'PopoverContent';
PopoverAnchor.displayName = 'PopoverAnchor';
namespace Type {
  export type Popover = PopoverProps;
  export type PopoverTrigger = PopoverTriggerProps;
  export type PopoverAnchor = PopoverAnchorProps;
  export type PopoverContent = PopoverContentProps;
}

export * from "@radix-ui/react-popover"
export {
  popoverVariants,
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverContent,
  type Type
}
