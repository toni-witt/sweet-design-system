"use client";

import { type ComponentProps } from "react"
import {
  Root,
  Group as SelectGroup,
  Value as SelectValue,
  Trigger,
  ScrollUpButton,
  ScrollDownButton,
  Content,
  Portal,
  Viewport,
  Label,
  Item,
  ItemIndicator,
  ItemText,
  Separator
} from "@radix-ui/react-select"
import { tv } from "tailwind-variants"
import { Icon } from "@/components/lab/uitimate/icon"
import { casing } from "@/components/lab/uitimate/utils"

const selectVariants = tv({
  slots: {
    trigger: [
      // h-10, shadow-xs aligns with the design of the input when they put together
      "flex h-10 w-full items-center justify-between whitespace-nowrap",
      "rounded-md border border-input bg-transparent",
      "px-3 py-2 text-sm shadow-xs",
      "ring-offset-background placeholder:text-muted-foreground",
      "focus:outline-hidden focus:ring-1 focus:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "[&>span]:line-clamp-1"
    ],
    scrollButton: "flex cursor-default items-center justify-center py-1",
    content: [
      "relative z-50 max-h-96 min-w-[8rem]",
      "overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    ],
    viewport: "p-1",
    label: "px-2 py-1.5 text-sm font-semibold",
    item: [
      "relative flex w-full cursor-default select-none items-center",
      "rounded-sm py-1.5 pl-2 pr-8 text-sm outline-hidden",
      "focus:bg-surface-2 focus:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50"
    ],
    itemIndicatorWrapper: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
    separator: "-mx-1 my-1 h-px bg-surface-2"
  },
  variants: {
    position: {
      popper: {
        content: [
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1",
          "data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
        ],
        viewport: "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
      },
      "item-aligned": {}
    }
  },
  defaultVariants: {
    position: "popper"
  }
})

const { trigger, scrollButton, content, viewport, label, item, itemIndicatorWrapper, separator } = selectVariants()

type SelectProps = ComponentProps<typeof Root> & {
  onChange?: (value: string) => void
}
/**
 * #20250318
 * #1,
 * This is literally for supporting the integration with React-hook-form (RHF).
 * To allow RHF to control this very form element, the component must provide the standard props:
 * - value
 * - onChange
 * - onBlur
 *
 * Since Radix uses the non-standard ones, here we need to manually connect them as shown in #1.
 */
const Select = ({ onChange, onValueChange, ...props }: SelectProps) => (
  <Root
    data-tag={casing.kebabCase(Select.displayName)}
    onValueChange={v => { // #1
      onChange?.(v)
      onValueChange?.(v)
    }}
    {...props}
  />
)

type SelectTriggerProps = ComponentProps<typeof Trigger>
const SelectTrigger = ({ className, children, ...props }: SelectTriggerProps) => (
  <Trigger
    data-tag={casing.kebabCase(SelectTrigger.displayName)}
    className={trigger({ className })}
    {...props}
  >
    {children}
    <Icon icon="lucide:chevron-down" className="h-4 w-4 opacity-50" />
  </Trigger>
)

type SelectScrollUpButtonProps = ComponentProps<typeof ScrollUpButton>
const SelectScrollUpButton = ({ className, ...props }: SelectScrollUpButtonProps) => (
  <ScrollUpButton
    data-tag={casing.kebabCase(SelectScrollUpButton.displayName)}
    className={scrollButton({ className })}
    {...props}
  >
    <Icon icon="lucide:chevron-up" className="h-4 w-4" />
  </ScrollUpButton>
)

type SelectScrollDownButtonProps = ComponentProps<typeof ScrollDownButton>
const SelectScrollDownButton = ({ className, ...props }: SelectScrollDownButtonProps) => (
  <ScrollDownButton
    data-tag={casing.kebabCase(SelectScrollDownButton.displayName)}
    className={scrollButton({ className })}
    {...props}
  >
    <Icon icon="lucide:chevron-down" className="h-4 w-4" />
  </ScrollDownButton>
)

type SelectContentProps = ComponentProps<typeof Content>
const SelectContent = ({ className, children, position = "popper", ...props }: SelectContentProps) => (
  <Portal>
    <Content
      data-tag={casing.kebabCase(SelectContent.displayName)}
      className={content({ position, className })}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <Viewport className={viewport({ position })}>
        {children}
      </Viewport>
      <SelectScrollDownButton />
    </Content>
  </Portal>
)

type SelectLabelProps = ComponentProps<typeof Label>
const SelectLabel = ({ className, ...props }: SelectLabelProps) => (
  <Label
    data-tag={casing.kebabCase(SelectLabel.displayName)}
    className={label({ className })}
    {...props}
  />
)

type SelectItemProps = ComponentProps<typeof Item>
const SelectItem = ({ className, children, ...props }: SelectItemProps) => (
  <Item
    data-tag={casing.kebabCase(SelectItem.displayName)}
    className={item({ className })}
    {...props}
  >
    <span className={itemIndicatorWrapper()}>
      <ItemIndicator>
        <Icon icon="lucide:check" className="h-4 w-4" />
      </ItemIndicator>
    </span>
    <ItemText>{children}</ItemText>
  </Item>
)

type SelectSeparatorProps = ComponentProps<typeof Separator>
const SelectSeparator = ({ className, ...props }: SelectSeparatorProps) => (
  <Separator
    data-tag={casing.kebabCase(SelectSeparator.displayName)}
    className={separator({ className })}
    {...props}
  />
)

Select.displayName = "Select"
SelectGroup.displayName = "SelectGroup"
SelectValue.displayName = "SelectValue"
SelectTrigger.displayName = "SelectTrigger"
SelectContent.displayName = "SelectContent"
SelectLabel.displayName = "SelectLabel"
SelectItem.displayName = "SelectItem"
SelectSeparator.displayName = "SelectSeparator"
SelectScrollUpButton.displayName = "SelectScrollUpButton"
SelectScrollDownButton.displayName = "SelectScrollDownButton"

namespace Type {
  export type Select = SelectProps
  export type SelectTrigger = SelectTriggerProps
  export type SelectScrollUpButton = SelectScrollUpButtonProps
  export type SelectScrollDownButton = SelectScrollDownButtonProps
  export type SelectContent = SelectContentProps
  export type SelectLabel = SelectLabelProps
  export type SelectItem = SelectItemProps
  export type SelectSeparator = SelectSeparatorProps
}

export * from "@radix-ui/react-select"
export {
  type Type,
  selectVariants,
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  /**
   * These should be rare to be used, but exported anyway in case there're some edge cases.
   */
  SelectScrollUpButton,
  SelectScrollDownButton
}
