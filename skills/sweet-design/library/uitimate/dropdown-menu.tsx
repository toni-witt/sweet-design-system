"use client";

import { type ComponentProps } from "react"
import {
  Root as DropdownMenu,
  Trigger,
  Group as DropdownMenuGroup,
  Portal as DropdownMenuPortal,
  Sub as DropdownMenuSub,
  RadioGroup as DropdownMenuRadioGroup,
  SubTrigger,
  SubContent,
  Content,
  Item,
  CheckboxItem,
  RadioItem,
  Label,
  Separator,
  ItemIndicator,
  type DropdownMenuProps,
  type DropdownMenuTriggerProps,
  type DropdownMenuPortalProps,
  type DropdownMenuSubProps,
  type DropdownMenuGroupProps,
  type DropdownMenuSubTriggerProps,
  type DropdownMenuSubContentProps,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
  type DropdownMenuCheckboxItemProps,
  type DropdownMenuRadioItemProps,
  type DropdownMenuLabelProps,
  type DropdownMenuSeparatorProps,
  type DropdownMenuRadioGroupProps,
} from "@radix-ui/react-dropdown-menu"
import { tv } from "tailwind-variants"
import { Icon } from "@/components/lab/uitimate/icon"
import { casing } from "@/components/lab/uitimate/utils"

const dropdownMenuVariants = tv({
  slots: {
    subTrigger: [
      "flex cursor-default gap-2 select-none justify-between items-center rounded-sm px-2 py-1.5 text-sm outline-hidden",
      "focus:bg-surface-2 data-[state=open]:bg-surface-2",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
    ],
    subContent: [
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    ],
    content: [
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    ],
    item: [
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors",
      "focus:bg-surface-2 focus:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      "[&>svg]:size-4 [&>svg]:shrink-0"
    ],
    checkboxItem: [
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden transition-colors",
      "focus:bg-surface-2 focus:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50"
    ],
    radioItem: [
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden transition-colors",
      "focus:bg-surface-2 focus:text-accent-foreground",
      "data-disabled:pointer-events-none data-disabled:opacity-50"
    ],
    label: "px-2 py-1.5 text-sm font-semibold",
    separator: "-mx-1 my-1 h-px bg-surface-2",
    shortcut: "ml-auto text-xs tracking-widest opacity-60"
  }
})
const {
  subTrigger,
  subContent,
  content,
  item,
  checkboxItem,
  radioItem,
  label,
  separator,
  shortcut
} = dropdownMenuVariants()


const DropdownMenuSubTrigger = ({ className, children, ...props }: DropdownMenuSubTriggerProps) => (
  <SubTrigger
    data-tag={casing.kebabCase(DropdownMenuSubTrigger.displayName)}
    className={subTrigger({ className })}
    {...props}
  >
    {children}
    <Icon icon="lucide:chevron-right" className="ml-auto" />
  </SubTrigger>
)

const DropdownMenuSubContent = ({
  className,
  ...props
}: DropdownMenuSubContentProps) => (
  <SubContent
    data-tag={casing.kebabCase(DropdownMenuSubContent.displayName)}
    className={subContent({ className })}
    {...props}
  />
)

const DropdownMenuContent = ({
  className,
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) => (
  <DropdownMenuPortal>
    <Content
      data-tag={casing.kebabCase(DropdownMenuContent.displayName)}
      sideOffset={sideOffset}
      className={content({ className })}
      {...props}
    />
  </DropdownMenuPortal>
)

const DropdownMenuItem = ({
  className,
  ...props
}: DropdownMenuItemProps) => (
  <Item
    data-tag={casing.kebabCase(DropdownMenuItem.displayName)}
    className={item({ className })}
    {...props}
  />
)

const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: DropdownMenuCheckboxItemProps) => (
  <CheckboxItem
    data-tag={casing.kebabCase(DropdownMenuCheckboxItem.displayName)}
    className={checkboxItem({ className })}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator><Icon icon="lucide:check" className="h-4 w-4" /></ItemIndicator>
    </span>
    {children}
  </CheckboxItem>
)

const DropdownMenuRadioItem = ({
  className,
  children,
  ...props
}: DropdownMenuRadioItemProps) => (
  <RadioItem
    data-tag={casing.kebabCase(DropdownMenuRadioItem.displayName)}
    className={radioItem({ className })}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator><Icon icon="lucide:circle" className="h-2 w-2 fill-current" /></ItemIndicator>
    </span>
    {children}
  </RadioItem>
)

const DropdownMenuLabel = ({
  className,
  ...props
}: DropdownMenuLabelProps) => (
  <Label
    data-tag={casing.kebabCase(DropdownMenuLabel.displayName)}
    className={label({ className })}
    {...props}
  />
)

const DropdownMenuSeparator = ({
  className,
  ...props
}: DropdownMenuSeparatorProps) => (
  <Separator
    data-tag={casing.kebabCase(DropdownMenuSeparator.displayName)}
    className={separator({ className })}
    {...props}
  />
)

type DropdownMenuShortcutProps = ComponentProps<'span'>
const DropdownMenuShortcut = ({
  className,
  ...props
}: DropdownMenuShortcutProps) => (
  <span
    data-tag={casing.kebabCase(DropdownMenuShortcut.displayName)}
    className={shortcut({ className })}
    {...props}
  />
)

const DropdownMenuTrigger = ({
  className,
  ...props
}: DropdownMenuTriggerProps) => (
  <Trigger
    data-tag={casing.kebabCase(DropdownMenuTrigger.displayName)}
    {...props}
  />
)

DropdownMenu.displayName = "DropdownMenu"
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"
DropdownMenuContent.displayName = "DropdownMenuContent"
DropdownMenuItem.displayName = "DropdownMenuItem"
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"
DropdownMenuLabel.displayName = "DropdownMenuLabel"
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"
DropdownMenuGroup.displayName = "DropdownMenuGroup"
DropdownMenuPortal.displayName = "DropdownMenuPortal"
DropdownMenuSub.displayName = "DropdownMenuSub"
DropdownMenuSubContent.displayName = "DropdownMenuSubContent"
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup"
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

namespace Type {
  export type DropdownMenu = DropdownMenuProps
  export type DropdownMenuTrigger = DropdownMenuTriggerProps
  export type DropdownMenuContent = DropdownMenuContentProps
  export type DropdownMenuItem = DropdownMenuItemProps
  export type DropdownMenuCheckboxItem = DropdownMenuCheckboxItemProps
  export type DropdownMenuLabel = DropdownMenuLabelProps
  export type DropdownMenuSeparator = DropdownMenuSeparatorProps
  export type DropdownMenuShortcut = DropdownMenuShortcutProps
  export type DropdownMenuGroup = DropdownMenuGroupProps
  export type DropdownMenuPortal = DropdownMenuPortalProps
  export type DropdownMenuSub = DropdownMenuSubProps
  export type DropdownMenuSubContent = DropdownMenuSubContentProps
  export type DropdownMenuSubTrigger = DropdownMenuSubTriggerProps
  export type DropdownMenuRadioGroup = DropdownMenuRadioGroupProps
  export type DropdownMenuRadioItem = DropdownMenuRadioItemProps
}

export * from "@radix-ui/react-dropdown-menu";
export {
  dropdownMenuVariants,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  type Type
}