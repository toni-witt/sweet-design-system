"use client";

import { Label, Arrow, Group, ItemIndicator, Root, Trigger, SubTrigger, SubContent, Content, Item, CheckboxItem, RadioItem, Separator, Menu as MenubarMenu, Portal as MenubarPortal, Sub as MenubarSub, RadioGroup as MenubarRadioGroup } from "@radix-ui/react-menubar"
import { type ComponentProps } from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { Icon } from "@/components/lab/uitimate/icon"
import { casing } from "@/components/lab/uitimate/utils"

const itemBaseStyle = [
  "relative flex cursor-default select-none items-center rounded-sm text-sm outline-hidden",
  "focus:bg-surface-2 focus:text-accent-foreground",
  "data-disabled:pointer-events-none data-disabled:opacity-50"
]
const menubarVariants = tv({
  slots: {
    root: "flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm",
    trigger: "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-hidden focus:bg-surface-2 focus:text-accent-foreground data-[state=open]:bg-surface-2 data-[state=open]:text-accent-foreground",
    subTrigger: [
      "flex cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-hidden",
      "focus:bg-surface-2 focus:text-accent-foreground",
      "data-[state=open]:bg-surface-2 data-[state=open]:text-accent-foreground"
    ],
    subContent: [
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    ],
    content: [
      "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    ],
    item: ["px-2 py-1.5", ...itemBaseStyle],
    formItem: ["py-1.5 pl-8 pr-2", ...itemBaseStyle],
    itemIndicator: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
    separator: "-mx-1 my-1 h-px bg-surface-2",
    shortcut: "ml-auto text-xs tracking-widest text-muted-foreground",
    label: "",
    arrow: "",
    group: "",

  }
})

const {
  root,
  trigger,
  subTrigger,
  subContent,
  content,
  item,
  formItem,
  itemIndicator,
  separator,
  shortcut,
  label,
  arrow,
  group
} = menubarVariants()

type MenubarProps = ComponentProps<typeof Root>;
const Menubar = ({ className, ...props }: MenubarProps) => (
  <Root
    data-tag={casing.kebabCase(Menubar.displayName)}
    className={root({ className })}
    {...props}
  />
);

type MenubarTriggerProps = ComponentProps<typeof Trigger>;
const MenubarTrigger = ({ className, ...props }: MenubarTriggerProps) => (
  <Trigger
    data-tag={casing.kebabCase(MenubarTrigger.displayName)}
    className={trigger({ className })}
    {...props}
  />
);

type MenubarSubTriggerProps = ComponentProps<typeof SubTrigger>;
const MenubarSubTrigger = ({ className, children, ...props }: MenubarSubTriggerProps) => (
  <SubTrigger
    data-tag={casing.kebabCase(MenubarSubTrigger.displayName)}
    className={subTrigger({ className })}
    {...props}
  >
    {children}
    <Icon icon="lucide:chevron-right" className="ml-auto h-4 w-4" />
  </SubTrigger>
);

type MenubarSubContentProps = ComponentProps<typeof SubContent>;
const MenubarSubContent = ({ className, ...props }: MenubarSubContentProps) => (
  <SubContent
    data-tag={casing.kebabCase(MenubarSubContent.displayName)}
    className={subContent({ className })}
    {...props}
  />
);

type MenubarContentProps = ComponentProps<typeof Content>;
const MenubarContent = ({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }: MenubarContentProps) => (
  <MenubarPortal>
    <Content
      data-tag={casing.kebabCase(MenubarContent.displayName)}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={content({ className })}
      {...props}
    />
  </MenubarPortal>
);

type MenubarItemProps = ComponentProps<typeof Item>;
const MenubarItem = ({ className, ...props }: MenubarItemProps) => (
  <Item
    data-tag={casing.kebabCase(MenubarItem.displayName)}
    className={item({ className })}
    {...props}
  />
);

type MenubarCheckboxItemProps = ComponentProps<typeof CheckboxItem>;
const MenubarCheckboxItem = ({ className, children, checked, ...props }: MenubarCheckboxItemProps) => (
  <CheckboxItem
    data-tag={casing.kebabCase(MenubarCheckboxItem.displayName)}
    className={formItem({ className })}
    checked={checked}
    {...props}
  >
    <span className={itemIndicator()}>
      <ItemIndicator>
        <Icon icon="lucide:check" className="h-4 w-4" />
      </ItemIndicator>
    </span>
    {children}
  </CheckboxItem>
);

type MenubarRadioItemProps = ComponentProps<typeof RadioItem>;
const MenubarRadioItem = ({ className, children, ...props }: MenubarRadioItemProps) => (
  <RadioItem
    data-tag={casing.kebabCase(MenubarRadioItem.displayName)}
    className={formItem({ className })}
    {...props}
  >
    <span className={itemIndicator()}>
      <ItemIndicator>
        <Icon icon="lucide:circle" className="h-4 w-4 fill-current" />
      </ItemIndicator>
    </span>
    {children}
  </RadioItem>
);

type MenubarSeparatorProps = ComponentProps<typeof Separator>;
const MenubarSeparator = ({ className, ...props }: MenubarSeparatorProps) => (
  <Separator
    data-tag={casing.kebabCase(MenubarSeparator.displayName)}
    className={separator({ className })}
    {...props}
  />
);

type MenubarShortcutProps = ComponentProps<"span">;
const MenubarShortcut = ({ className, ...props }: MenubarShortcutProps) => (
  <span
    data-tag={casing.kebabCase(MenubarShortcut.displayName)}
    className={shortcut({ className })}
    {...props}
  />
);

type MenubarLabelProps = ComponentProps<typeof Label>;
const MenubarLabel = ({ className, ...props }: MenubarLabelProps) => (
  <Label
    data-tag={casing.kebabCase(MenubarLabel.displayName)}
    className={label({ className })}
    {...props}
  />
);

type MenubarArrowProps = ComponentProps<typeof Arrow>;
const MenubarArrow = ({ className, ...props }: MenubarArrowProps) => (
  <Arrow
    data-tag={casing.kebabCase(MenubarArrow.displayName)}
    className={arrow({ className })}
    {...props}
  />
);

type MenubarGroupProps = ComponentProps<typeof Group>;
const MenubarGroup = ({ className, ...props }: MenubarGroupProps) => (
  <Group
    data-tag={casing.kebabCase(MenubarGroup.displayName)}
    className={group({ className })}
    {...props}
  />
);

Menubar.displayName = 'Menubar';
(MenubarMenu as { displayName?: string }).displayName = 'MenubarMenu';
MenubarPortal.displayName = 'MenubarPortal';
MenubarSub.displayName = 'MenubarSub';
MenubarRadioGroup.displayName = 'MenubarRadioGroup';
MenubarTrigger.displayName = 'MenubarTrigger';
MenubarSubTrigger.displayName = 'MenubarSubTrigger';
MenubarSubContent.displayName = 'MenubarSubContent';
MenubarContent.displayName = 'MenubarContent';
MenubarItem.displayName = 'MenubarItem';
MenubarCheckboxItem.displayName = 'MenubarCheckboxItem';
MenubarRadioItem.displayName = 'MenubarRadioItem';
MenubarSeparator.displayName = 'MenubarSeparator';
MenubarShortcut.displayName = "MenubarShortcut";
MenubarLabel.displayName = "MenubarLabel";
MenubarArrow.displayName = "MenubarArrow";
MenubarGroup.displayName = "MenubarGroup";

namespace Type {
  export type Menubar = MenubarProps;
  export type MenubarTrigger = MenubarTriggerProps;
  export type MenubarSubTrigger = MenubarSubTriggerProps;
  export type MenubarSubContent = MenubarSubContentProps;
  export type MenubarContent = MenubarContentProps;
  export type MenubarItem = MenubarItemProps;
  export type MenubarCheckboxItem = MenubarCheckboxItemProps;
  export type MenubarRadioItem = MenubarRadioItemProps;
  export type MenubarSeparator = MenubarSeparatorProps;
  export type MenubarShortcut = MenubarShortcutProps;
  export type MenubarLabel = MenubarLabelProps;
  export type MenubarArrow = MenubarArrowProps;
  export type MenubarGroup = MenubarGroupProps;
}

export * from "@radix-ui/react-menubar"
export {
  type Type,
  menubarVariants,
  Menubar,
  MenubarMenu,
  MenubarPortal,
  MenubarSub,
  MenubarRadioGroup,
  MenubarTrigger,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  /**
   * These should be rare to be used, but exported anyway in case there're some edge cases.
   */
  MenubarLabel,
  MenubarArrow,
  MenubarGroup,
}
