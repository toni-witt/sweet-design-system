"use client";

import { type ComponentProps } from "react"
import { casing } from '@/components/lab/uitimate/utils'
import {
  Root as ContextMenu,
  Trigger as ContextMenuTrigger,
  Group as ContextMenuGroup,
  Portal as ContextMenuPortal,
  Sub as ContextMenuSub,
  RadioGroup as ContextMenuRadioGroup,
  SubTrigger,
  SubContent,
  Content,
  Item,
  CheckboxItem,
  RadioItem,
  Label,
  Separator,
  ItemIndicator
} from "@radix-ui/react-context-menu"
import { tv } from "tailwind-variants"
import { Icon } from "@/components/lab/uitimate/icon"

const baseContentStyle = [
  "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
]
const itemBaseStyle = [
  "relative",
  "flex cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-hidden",
  "focus:bg-surface-2 focus:text-accent-foreground",
  "data-disabled:pointer-events-none data-disabled:opacity-50"
]
const contextMenuVariants = tv({
  slots: {
    subTrigger: [
      " px-2",
      "flex cursor-default select-none justify-between items-center rounded-sm py-1.5 text-sm outline-hidden",
      "focus:bg-surface-2 focus:text-accent-foreground",
      "data-[state=open]:bg-surface-2 data-[state=open]:text-accent-foreground"
    ],
    subContent: ["shadow-lg", ...baseContentStyle],
    content: ["shadow-md", ...baseContentStyle],
    item: ["px-2", ...itemBaseStyle],
    formItem: ["pl-8 pr-2", ...itemBaseStyle],
    label: "px-2 py-1.5 text-sm font-semibold text-foreground",
    separator: "-mx-1 my-1 h-px bg-border",
    shortcut: "ml-auto text-xs tracking-widest text-muted-foreground"
  },
  variants: {
    inset: {
      true: {
        subTrigger: "pl-8",
        item: "pl-8",
        label: "pl-8"
      }
    }
  }
})

type ContextMenuSubTriggerProps = ComponentProps<typeof SubTrigger> & { inset?: boolean }
const ContextMenuSubTrigger = ({
  className,
  inset,
  children,
  ...props
}: ContextMenuSubTriggerProps) => (
  <SubTrigger
    className={contextMenuVariants({ inset }).subTrigger({ className })}
    data-tag={casing.kebabCase(ContextMenuSubTrigger.displayName)}
    {...props}
  >
    {children}
    <Icon icon='lucide:chevron-right' className="ml-auto h-4 w-4" />
  </SubTrigger>
)

type ContextMenuSubContentProps = ComponentProps<typeof SubContent>
const ContextMenuSubContent = ({
  className,
  ...props
}: ContextMenuSubContentProps) => (
  <SubContent
    className={contextMenuVariants().subContent({ className })}
    data-tag={casing.kebabCase(ContextMenuSubContent.displayName)}
    {...props}
  />
)

type ContextMenuContentProps = ComponentProps<typeof Content>
const ContextMenuContent = ({
  className,
  ...props
}: ContextMenuContentProps) => (
  <ContextMenuPortal>
    <Content
      className={contextMenuVariants().content({ className })}
      data-tag={casing.kebabCase(ContextMenuContent.displayName)}
      {...props}
    />
  </ContextMenuPortal>
)

type ContextMenuItemProps = ComponentProps<typeof Item> & { inset?: boolean }
const ContextMenuItem = ({
  className,
  inset,
  ...props
}: ContextMenuItemProps) => (
  <Item
    className={contextMenuVariants({ inset }).item({ className })}
    data-tag={casing.kebabCase(ContextMenuItem.displayName)}
    {...props}
  />
)

type ContextMenuCheckboxItemProps = ComponentProps<typeof CheckboxItem>
const ContextMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: ContextMenuCheckboxItemProps) => (
  <CheckboxItem
    className={contextMenuVariants().formItem({ className })}
    data-tag={casing.kebabCase(ContextMenuCheckboxItem.displayName)}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator>
        <Icon icon='lucide:check' className="h-4 w-4" />
      </ItemIndicator>
    </span>
    {children}
  </CheckboxItem>
)

type ContextMenuRadioItemProps = ComponentProps<typeof RadioItem>
const ContextMenuRadioItem = ({
  className,
  children,
  ...props
}: ContextMenuRadioItemProps) => (
  <RadioItem
    className={contextMenuVariants().formItem({ className })}
    data-tag={casing.kebabCase(ContextMenuRadioItem.displayName)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ItemIndicator>
        <Icon icon='lucide:dot' className="h-4 w-4 fill-current" />
      </ItemIndicator>
    </span>
    {children}
  </RadioItem>
)

type ContextMenuLabelProps = ComponentProps<typeof Label> & { inset?: boolean }
const ContextMenuLabel = ({
  className,
  inset,
  ...props
}: ContextMenuLabelProps) => (
  <Label
    className={contextMenuVariants({ inset }).label({ className })}
    data-tag={casing.kebabCase(ContextMenuLabel.displayName)}
    {...props}
  />
)

type ContextMenuSeparatorProps = ComponentProps<typeof Separator>
const ContextMenuSeparator = ({
  className,
  ...props
}: ContextMenuSeparatorProps) => (
  <Separator
    className={contextMenuVariants().separator({ className })}
    data-tag={casing.kebabCase(ContextMenuSeparator.displayName)}
    {...props}
  />
)

type ContextMenuShortcutProps = ComponentProps<'span'>
const ContextMenuShortcut = ({
  className,
  ...props
}: ContextMenuShortcutProps) => (
  <span
    className={contextMenuVariants().shortcut({ className })}
    data-tag={casing.kebabCase(ContextMenuShortcut.displayName)}
    {...props}
  />
)

ContextMenu.displayName = "ContextMenu"
ContextMenuTrigger.displayName = "ContextMenuTrigger"
ContextMenuContent.displayName = "ContextMenuContent"
ContextMenuItem.displayName = "ContextMenuItem"
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem"
ContextMenuRadioItem.displayName = "ContextMenuRadioItem"
ContextMenuLabel.displayName = "ContextMenuLabel"
ContextMenuSeparator.displayName = "ContextMenuSeparator"
ContextMenuShortcut.displayName = "ContextMenuShortcut"
ContextMenuGroup.displayName = "ContextMenuGroup"
ContextMenuPortal.displayName = "ContextMenuPortal"
ContextMenuSub.displayName = "ContextMenuSub"
ContextMenuSubContent.displayName = "ContextMenuSubContent"
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger"
ContextMenuRadioGroup.displayName = "ContextMenuRadioGroup"

namespace Type {
  export type ContextMenu = typeof ContextMenu
  export type ContextMenuTrigger = typeof ContextMenuTrigger
  export type ContextMenuContent = typeof ContextMenuContent
  export type ContextMenuItem = typeof ContextMenuItem
  export type ContextMenuCheckboxItem = typeof ContextMenuCheckboxItem
  export type ContextMenuRadioItem = typeof ContextMenuRadioItem
  export type ContextMenuLabel = typeof ContextMenuLabel
  export type ContextMenuSeparator = typeof ContextMenuSeparator
  export type ContextMenuShortcut = typeof ContextMenuShortcut
}

export * from "@radix-ui/react-context-menu";
export {
  type Type,
  contextMenuVariants,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  /**
   * These should be rare to be used, but exported anyway in case there're some edge cases.
   */
  ContextMenuPortal,
}
