"use client";

import { type ComponentProps } from "react";
import { Root, Item, Trigger, Content, Header } from "@radix-ui/react-accordion"
import { tv } from "tailwind-variants"
import { Icon } from "@/components/lab/uitimate/icon"
import './accordion.css'
import { casing } from "@/components/lab/uitimate/utils"

const accordionVariants = tv({
  slots: {
    item: [
      "border-b",
      "data-[disabled]:text-muted-foreground"
    ],
    trigger: [
      "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all text-left",
      "hover:cursor-pointer",
      "[&[data-state=open]_[data-icon]]:rotate-180"
    ],
    content: [
      "overflow-hidden text-sm",
      "data-[state=closed]:[animation:var(--animate-accordion-up)] data-[state=open]:[animation:var(--animate-accordion-down)]",
    ],
    contentInner: [
      "pb-4 pt-0"
    ]
  }
})
const { item, trigger, content, contentInner } = accordionVariants()

type AccordionItemProps = ComponentProps<typeof Item>
const AccordionItem = ({
  className,
  ...props
}: AccordionItemProps) => {
  return (
    <Item
      className={item({ className })}
      data-tag={casing.kebabCase(AccordionItem.displayName)}
      {...props}
    />
  )
}

/**
 * Usage Note:
 *  - in 99% of time, this is NOT recommended to be used directly, cuz we already encapsulate it in AccordionTrigger
 */
type AccordionHeaderProps = ComponentProps<typeof Header>
const AccordionHeader = Header;

/**
 * FIXME: it seems like providing a wrapper <span> for children is a far more better idea,
 * otherwise the flex context of Trigger will affect the children, and in some cases, the style will be very bad,
 * so that the consumer needs to fix it by wrapping their children with <span> or so
 *
 * FIXME: Also, once apply the wrapper, it's a good idea to default have `leading-loose` in case of the children can be a multiple lines
 */
type AccordionTriggerProps = ComponentProps<typeof Trigger>
const AccordionTrigger = ({
  className,
  children,
  ...props
}: AccordionTriggerProps) => {
  return (
    <AccordionHeader className="flex">
      <Trigger
        className={trigger({ className })}
        data-tag={casing.kebabCase(AccordionTrigger.displayName)}
        {...props}
      >
        {children}
        <Icon
          icon="lucide:chevron-down"
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
        />
      </Trigger>
    </AccordionHeader>
  )
}

type AccordionContentProps = ComponentProps<typeof Content>
const AccordionContent = ({
  className,
  children,
  ...props
}: AccordionContentProps) => {
  return (
    <Content
      className={content()}
      data-tag={casing.kebabCase(AccordionContent.displayName)}
      {...props}
    >
      <div className={contentInner({ className })}>
        {children}
      </div>
    </Content>
  )
}

/**
 * Usage Note:
 *  for some props of Accordion,
 *  - orientation='horizontal' seems not working
 *  - `defaultValue` can be replaced by `value`
 */
type AccordionProps = ComponentProps<typeof Root>
const Accordion = Root;

Accordion.displayName = "Accordion"
AccordionItem.displayName = "AccordionItem"
AccordionTrigger.displayName = "AccordionTrigger"
AccordionContent.displayName = "AccordionContent"
AccordionHeader.displayName = "AccordionHeader"

namespace Type {
  export type AccordionItem = AccordionItemProps;
  export type AccordionTrigger = AccordionTriggerProps;
  export type AccordionContent = AccordionContentProps;
  export type AccordionHeader = AccordionHeaderProps;
  export type Accordion = AccordionProps;
}

export * from "@radix-ui/react-accordion";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionHeader,
  accordionVariants,
  type Type
}