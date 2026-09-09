"use client";

import { type ComponentProps } from "react"
import {
  Provider,
  Root,
  Trigger,
  Content,
  Portal
} from "@radix-ui/react-tooltip"
import { tv } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"

const tooltipVariants = tv({
  base: [
    "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground",
    "animate-in fade-in-0 zoom-in-95",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
  ]
})

type TooltipProviderProps = ComponentProps<typeof Provider>
const TooltipProvider = ({ ...props }: TooltipProviderProps) => <Provider data-tag={casing.kebabCase(TooltipProvider.displayName)} {...props} />

type TooltipProps = ComponentProps<typeof Root>
const Tooltip = ({ ...props }: TooltipProps) => (
  <TooltipProvider>
    <Root data-tag={casing.kebabCase(Tooltip.displayName)} {...props} />
  </TooltipProvider>
)

type TooltipTriggerProps = ComponentProps<typeof Trigger>
const TooltipTrigger = ({ ...props }: TooltipTriggerProps) => (
  <Trigger data-tag={casing.kebabCase(TooltipTrigger.displayName)} {...props} />
)

type TooltipContentProps = ComponentProps<typeof Content>
const TooltipContent = ({
  className,
  sideOffset = 4,
  ...props
}: TooltipContentProps) => (
  <Portal>
    <Content
      data-tag={casing.kebabCase(TooltipContent.displayName)}
      sideOffset={sideOffset}
      className={tooltipVariants({ className })}
      {...props}
    />
  </Portal>
)

Tooltip.displayName = 'Tooltip'
TooltipTrigger.displayName = 'TooltipTrigger'
TooltipContent.displayName = 'TooltipContent'
TooltipProvider.displayName = 'TooltipProvider'

namespace Type {
  export type Tooltip = TooltipProps
  export type TooltipTrigger = TooltipTriggerProps
  export type TooltipContent = TooltipContentProps
  export type TooltipProvider = TooltipProviderProps
}

export * from "@radix-ui/react-tooltip"
export {
  type Type,
  tooltipVariants,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
}
