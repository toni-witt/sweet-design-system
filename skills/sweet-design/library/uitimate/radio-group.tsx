"use client";

import { type ComponentProps } from "react"
import { Root, Item, type RadioGroupItemProps, type RadioGroupIndicatorProps, RadioGroupIndicator } from "@radix-ui/react-radio-group"
import { tv } from "tailwind-variants"
import { Icon } from "@/components/lab/uitimate/icon"
import { casing } from "@/components/lab/uitimate/utils"

const radioGroupVariants = tv({
  slots: {
    root: "grid gap-3",
    item: [
      "aspect-square size-4 shrink-0 rounded-full",
      "border border-input shadow-xs",
      "transition-[color,box-shadow]",

      "text-primary ring-ring/10 dark:ring-ring/20",
      "dark:outline-ring/40 outline-ring/50",

      "focus-visible:ring-4 focus-visible:outline-1",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-invalid:focus-visible:ring-0"
    ],
    indicator: "relative flex items-center justify-center"
  }
})

const { root, item, indicator } = radioGroupVariants()

type RadioGroupProps = ComponentProps<typeof Root> & {
  onChange?: (value: string) => void
}
const RadioGroup = ({
  className,
  onChange,
  onValueChange,
  ...props
}: RadioGroupProps) => (
  <Root
    data-slot="radio-group"
    data-tag={casing.kebabCase(RadioGroup.displayName)}
    className={root({ className })}
    onValueChange={(v: any) => { // see #20250318
      onChange?.(v as any);
      onValueChange?.(v);
    }}
    {...props}
  />
)

const RadioGroupItem = ({
  className,
  ...props
}: RadioGroupItemProps) => (
  <Item
    data-slot="radio-group-item"
    data-tag={casing.kebabCase(RadioGroupItem.displayName)}
    className={item({ className })}
    {...props}
  >
    <RadioGroupIndicator
      data-slot="radio-group-indicator"
      data-tag={casing.kebabCase(RadioGroupIndicator.displayName!)}
      className={indicator()}
    >
      <Icon
        icon="lucide:circle"
        className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2"
      />
    </RadioGroupIndicator>
  </Item>
)

RadioGroup.displayName = "RadioGroup"
RadioGroupItem.displayName = "RadioGroupItem"
RadioGroupIndicator.displayName = "RadioGroupIndicator"

namespace Type {
  export type RadioGroup = RadioGroupProps
  export type RadioGroupItem = RadioGroupItemProps
  export type RadioGroupIndicator = RadioGroupIndicatorProps
}

export * from "@radix-ui/react-radio-group"
export {
  radioGroupVariants,
  RadioGroup,
  RadioGroupItem,
  type Type
}
