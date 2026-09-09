"use client";

import { Root, List, Trigger, Content } from "@radix-ui/react-tabs"
import { tv } from 'tailwind-variants'
import { createContext, useContext, type ComponentProps } from 'react'
import { casing } from '@/components/lab/uitimate/utils'

const TabsVariantContext = createContext<{ variant: 'pill' | 'underline' }>({ variant: 'pill' })

type TabsProps = ComponentProps<typeof Root> & { variant: 'pill' | 'underline' }
const Tabs = ({ variant, ...props }: TabsProps) => (
  <TabsVariantContext.Provider value={{ variant }}>
    <Root data-tag={casing.kebabCase(Tabs.displayName)} {...props} />
  </TabsVariantContext.Provider>
)

const tabsListVariants = tv({
  base: 'has-data-[tag=tabs-trigger]:mb-3',
  variants: {
    variant: {
      pill: "inline-flex h-9 items-center justify-center rounded-lg bg-surface-2 p-1 text-muted-foreground",
      underline: "w-full justify-start rounded-none bg-transparent p-0",
    },
  },
})
type TabsListProps = ComponentProps<typeof List>
const TabsList = ({ className, ...props }: TabsListProps) => {
  const { variant } = useContext(TabsVariantContext)
  return (
    <List
      data-tag={casing.kebabCase(TabsList.displayName)}
      className={tabsListVariants({ variant, className })}
      {...props}
    />
  )
}

const tabsTriggerVariants = tv({
  variants: {
    variant: {
      pill: [
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
      ],
      underline: [
        "relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 text-muted-foreground shadow-none transition-none",
        "data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
      ]
    },
  },
})
type TabsTriggerProps = ComponentProps<typeof Trigger>
const TabsTrigger = ({ className, ...props }: TabsTriggerProps) => {
  const { variant } = useContext(TabsVariantContext)
  return (
    <Trigger
      data-tag={casing.kebabCase(TabsTrigger.displayName)}
      className={tabsTriggerVariants({ variant, className })}
      {...props}
    />
  )
}

const tabsContentVariants = tv({
  base: [
    "ring-offset-background",
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  ]
})
type TabsContentProps = ComponentProps<typeof Content>
const TabsContent = ({ className, ...props }: TabsContentProps) => (
  <Content
    data-tag={casing.kebabCase(TabsContent.displayName)}
    className={tabsContentVariants({ className })}
    {...props}
  />
)

Tabs.displayName = 'Tabs'
TabsList.displayName = 'TabsList'
TabsTrigger.displayName = 'TabsTrigger'
TabsContent.displayName = 'TabsContent'

namespace Type {
  export type Tabs = TabsProps
  export type TabsList = TabsListProps
  export type TabsTrigger = TabsTriggerProps
  export type TabsContent = TabsContentProps
}

export * from "@radix-ui/react-tabs"
export {
  type Type,
  TabsVariantContext,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
}
