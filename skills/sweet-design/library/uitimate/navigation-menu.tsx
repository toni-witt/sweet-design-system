"use client";

import { type ComponentProps } from "react"
import { Root, List, Item, Trigger, Content, Link, Viewport, Indicator, Sub as NavigationSubMenu } from "@radix-ui/react-navigation-menu"
import { tv } from "tailwind-variants"
import { Icon } from "@/components/lab/uitimate/icon"
import { casing } from "@/components/lab/uitimate/utils"

const navigationMenuVariants = tv({
  slots: {
    root: "relative z-10 flex max-w-max flex-1 items-center justify-center",
    list: "group flex flex-1 list-none items-center justify-center space-x-1",
    trigger: [
      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors",
      "hover:bg-surface-2 hover:text-accent-foreground",
      "focus:bg-surface-2 focus:text-accent-foreground focus:outline-hidden",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-active:bg-surface-2/50 data-[state=open]:bg-surface-2/50"
    ],
    triggerIcon: [
      "relative top-[1px] ml-1 h-3 w-3 transition duration-300",
      "group-data-[state=open]:rotate-180"
    ],
    content: [
      "left-0 top-0 w-full md:absolute md:w-auto",
      "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
      "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
      "data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52"
    ],
    viewportWrapper: "absolute left-0 top-full flex justify-center",
    viewport: [
      "origin-top-center relative mt-1.5 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow",
      "h-(--radix-navigation-menu-viewport-height) md:w-(--radix-navigation-menu-viewport-width)",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90"
    ],
    indicator: [
      "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
      "data-[state=visible]:animate-in data-[state=hidden]:animate-out",
      "data-[state=hidden]:fade-out data-[state=visible]:fade-in"
    ],
    indicatorArrow: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md",
    item: ""
  }
})

const {
  root,
  list,
  trigger,
  triggerIcon,
  content,
  viewportWrapper,
  viewport,
  indicator,
  indicatorArrow,
  item
} = navigationMenuVariants()

type NavigationMenuListProps = ComponentProps<typeof List>
const NavigationMenuList = ({
  className,
  ...props
}: NavigationMenuListProps) => (
  <List data-tag={casing.kebabCase(NavigationMenuList.displayName)} className={list({ className })} {...props} />
)

type NavigationMenuProps = ComponentProps<typeof Root>
const NavigationMenu = ({
  className,
  children,
  ...props
}: NavigationMenuProps) => (
  <Root
    data-tag={casing.kebabCase(NavigationMenu.displayName)}
    className={root({ className })}
    {...props}
  >
    <NavigationMenuList>
      {children}
    </NavigationMenuList>
    <NavigationMenuViewport />
  </Root>
)

type NavigationMenuItemProps = ComponentProps<typeof Item>
const NavigationMenuItem = ({
  className,
  ...props
}: NavigationMenuItemProps) => (
  <Item data-tag={casing.kebabCase(NavigationMenuItem.displayName)} className={item({ className })} {...props} />
)

type NavigationMenuTriggerProps = ComponentProps<typeof Trigger>
const NavigationMenuTrigger = ({
  className,
  children,
  ...props
}: NavigationMenuTriggerProps) => (
  <Trigger
    data-tag={casing.kebabCase(NavigationMenuTrigger.displayName)}
    className={trigger({ className })}
    {...props}
  >
    {children}{" "}
    <Icon icon='lucide:chevron-down' className={triggerIcon()} aria-hidden="true" />
  </Trigger>
)

type NavigationMenuContentProps = ComponentProps<typeof Content>
const NavigationMenuContent = ({
  className,
  ...props
}: NavigationMenuContentProps) => (
  <Content
    data-tag={casing.kebabCase(NavigationMenuContent.displayName)}
    className={content({ className })}
    {...props}
  />
)

type NavigationMenuViewportProps = ComponentProps<typeof Viewport>
const NavigationMenuViewport = ({
  className,
  ...props
}: NavigationMenuViewportProps) => (
  <div className={viewportWrapper()} data-tag={casing.kebabCase(NavigationMenuViewport.displayName)}>
    <Viewport
      className={viewport({ className })}
      {...props}
    />
  </div>
)

type NavigationMenuIndicatorProps = ComponentProps<typeof Indicator>
const NavigationMenuIndicator = ({
  className,
  ...props
}: NavigationMenuIndicatorProps) => (
  <Indicator
    data-tag={casing.kebabCase(NavigationMenuIndicator.displayName)}
    className={indicator({ className })}
    {...props}
  >
    <div className={indicatorArrow()} />
  </Indicator>
)

type NavigationMenuLinkProps = ComponentProps<typeof Link>
const NavigationMenuLink = ({
  className,
  ...props
}: NavigationMenuLinkProps) => (
  <Link
    data-tag={casing.kebabCase(NavigationMenuLink.displayName)}
    className={trigger({ className })}
    {...props}
  />
)

NavigationMenu.displayName = "NavigationMenu"
NavigationMenuItem.displayName = "NavigationMenuItem"
NavigationMenuTrigger.displayName = "NavigationMenuTrigger"
NavigationMenuContent.displayName = "NavigationMenuContent"
NavigationMenuLink.displayName = "NavigationMenuLink"
NavigationMenuList.displayName = "NavigationMenuList"
NavigationMenuViewport.displayName = "NavigationMenuViewport"
NavigationMenuIndicator.displayName = "NavigationMenuIndicator"
NavigationSubMenu.displayName = "NavigationSubMenu"

namespace Type {
  export type NavigationMenu = NavigationMenuProps
  export type NavigationMenuItem = NavigationMenuItemProps
  export type NavigationMenuTrigger = NavigationMenuTriggerProps
  export type NavigationMenuContent = NavigationMenuContentProps
  export type NavigationMenuLink = NavigationMenuLinkProps
  export type NavigationMenuList = NavigationMenuListProps
  export type NavigationMenuViewport = NavigationMenuViewportProps
  export type NavigationMenuIndicator = NavigationMenuIndicatorProps
  export type NavigationSubMenu = ComponentProps<typeof NavigationSubMenu>
}

export * from "@radix-ui/react-navigation-menu"
export {
  type Type,
  navigationMenuVariants,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  /**
   * These should be rare to be used, but exported anyway in case there're some edge cases.
  */
  NavigationMenuList,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  NavigationSubMenu, // this really doesn't make sense to be used, cuz we can implement that using Tabs
}

