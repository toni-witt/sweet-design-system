"use client";

import { type ComponentProps } from "react"
import { Root, Trigger, Content } from "@radix-ui/react-hover-card"
import { tv } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"

const hoverCardVariants = tv({
  base: [
    "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
  ]
})

type HoverCardProps = ComponentProps<typeof Root>
const HoverCard = (props: HoverCardProps) => (
  <Root data-tag={casing.kebabCase(HoverCard.displayName)} {...props} />
)

type HoverCardTriggerProps = ComponentProps<typeof Trigger>
const HoverCardTrigger = (props: HoverCardTriggerProps) => (
  <Trigger data-tag={casing.kebabCase(HoverCardTrigger.displayName)} {...props} />
)

type HoverCardContentProps = ComponentProps<typeof Content>
const HoverCardContent = ({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: HoverCardContentProps) => (
  <Content
    data-tag={casing.kebabCase(HoverCardContent.displayName)}
    align={align}
    sideOffset={sideOffset}
    className={hoverCardVariants({ className })}
    {...props}
  />
)

HoverCard.displayName = 'HoverCard'
HoverCardTrigger.displayName = 'HoverCardTrigger'
HoverCardContent.displayName = 'HoverCardContent'

namespace Type {
  export type HoverCard = HoverCardProps
  export type HoverCardTrigger = HoverCardTriggerProps
  export type HoverCardContent = HoverCardContentProps
}

export * from "@radix-ui/react-hover-card";
export {
  hoverCardVariants,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  type Type
}
