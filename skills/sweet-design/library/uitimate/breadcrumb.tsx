"use client";

import { Slot } from "@/components/lab/uitimate/slot"
import { type ComponentProps } from "react"
import { Icon } from "@/components/lab/uitimate/icon"
import { tv } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"

const breadcrumbVariants = tv({
  slots: {
    nav: "inline-block",
    list: "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
    item: "inline-flex items-center gap-1.5",
    link: "transition-colors hover:text-foreground",
    final: "font-normal text-foreground",
    ellipsis: "flex h-4 w-4 items-center justify-center",
    separator: "[&_[data-icon]]:w-3.5 [&_[data-icon]]:h-3.5"
  }
})

const { nav, list, item, link, final, ellipsis, separator } = breadcrumbVariants()

/**
 * Design Note:
 * `nav` is like a ghost, and it shouldn't have problem for issues like styling such as:
 *  - styling on <nav>: in most of time, no need to style on <nav>
 *  - styling on <ol>: having full width will have problem due to the default style of <ol>, but such component shouldn't need to be full width
 */
type BreadcrumbProps = ComponentProps<'ol'>;
const Breadcrumb = ({
  className,
  children,
  ...props
}: BreadcrumbProps) => (
  <nav
    data-tag={casing.kebabCase(Breadcrumb.displayName)}
    className={nav({})}
    aria-label="breadcrumb"
  >
    <ol
      className={list({ className })}
      {...props}
    >
      {children}
    </ol>
  </nav>
)

type BreadcrumbItemProps = ComponentProps<'li'>;
const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => (
  <li
    data-tag={casing.kebabCase(BreadcrumbItem.displayName)}
    className={item({ className })}
    {...props}
  />
)

type BreadcrumbLinkProps = ComponentProps<'a'> & { asChild?: boolean };
const BreadcrumbLink = ({ asChild, className, ...props }: BreadcrumbLinkProps) => {
  const Comp = asChild ? Slot : "a"
  return (
    <Comp
      data-tag={casing.kebabCase(BreadcrumbLink.displayName)}
      className={link({ className })}
      {...props}
    />
  )
}

/**
 * This is the component, having more eye-catching style than other similar items,
 * that we usually use as the final item of the entire breadcrumb component composition
 * to indicate the current viewing page.
 */
type BreadcrumbFinalProps = ComponentProps<'span'>;
const BreadcrumbFinal = ({ className, ...props }: BreadcrumbFinalProps) => (
  <span
    data-tag={casing.kebabCase(BreadcrumbFinal.displayName)}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={final({ className })}
    {...props}
  />
)

type BreadcrumbEllipsisProps = ComponentProps<'span'>;
const BreadcrumbEllipsis = ({ className, ...props }: BreadcrumbEllipsisProps) => (
  <span
    data-tag={casing.kebabCase(BreadcrumbEllipsis.displayName)}
    className={ellipsis({ className })}
    {...props}
  >
    <Icon icon="lucide:more-horizontal" className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)

type BreadcrumbSeparatorProps = ComponentProps<'li'>;
const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => (
  <li
    data-tag={casing.kebabCase(BreadcrumbSeparator.displayName)}
    role="presentation"
    aria-hidden="true"
    className={separator({ className })}
    {...props}
  >
    {children || <Icon icon="lucide:chevron-right" className="text-muted-foreground/40" />}
  </li>
)

Breadcrumb.displayName = "Breadcrumb";
BreadcrumbItem.displayName = "BreadcrumbItem";
BreadcrumbLink.displayName = "BreadcrumbLink";
BreadcrumbFinal.displayName = "BreadcrumbFinal";
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

namespace Type {
  export type Breadcrumb = BreadcrumbProps;
  export type BreadcrumbItem = BreadcrumbItemProps;
  export type BreadcrumbLink = BreadcrumbLinkProps;
  export type BreadcrumbFinal = BreadcrumbFinalProps;
  export type BreadcrumbEllipsis = BreadcrumbEllipsisProps;
  export type BreadcrumbSeparator = BreadcrumbSeparatorProps;
}

export {
  type Type,
  breadcrumbVariants,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbFinal,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
