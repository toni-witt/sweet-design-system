"use client";

import { type ComponentProps } from "react"
import { buttonVariants } from "@/components/lab/uitimate/cta"
import { tv } from "tailwind-variants"
import { Icon } from "@/components/lab/uitimate/icon"

const paginationVariants = tv({
  slots: {
    nav: "mx-auto flex w-full justify-center",
    list: "flex flex-row items-center gap-1",
    previous: "gap-1 pl-2.5",
    next: "gap-1 pr-2.5",
    ellipsis: "flex h-9 w-9 items-center justify-center"
  }
})
const {
  nav,
  list,
  previous,
  next,
  ellipsis
} = paginationVariants()

type PaginationProps = ComponentProps<"nav">
const Pagination = ({
  className,
  children,
  ...props
}: PaginationProps) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={nav({ className })}
    {...props}
  >
    <ul className={list()}>{children}</ul>
  </nav>
)
type PaginationItemProps = ComponentProps<"li">
const PaginationItem = ({ ...props }: PaginationItemProps) => <li {...props} />

type PaginationLinkProps = ComponentProps<"a"> & {
  isActive?: boolean
}
const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={buttonVariants({ variant: isActive ? "outline" : "ghost", className })}
    {...props}
  />
)

type PaginationPreviousProps = PaginationLinkProps
const PaginationPrevious = ({
  className,
  ...props
}: PaginationPreviousProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={previous({ className })}
    {...props}
  >
    <Icon icon='lucide:chevron-left' className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)

type PaginationNextProps = PaginationLinkProps
const PaginationNext = ({
  className,
  ...props
}: PaginationNextProps) => (
  <PaginationLink
    aria-label="Go to next page"
    className={next({ className })}
    {...props}
  >
    <span>Next</span>
    <Icon icon='lucide:chevron-right' className="h-4 w-4" />
  </PaginationLink>
)

type PaginationEllipsisProps = ComponentProps<"span">
const PaginationEllipsis = ({
  className,
  ...props
}: PaginationEllipsisProps) => (
  <span
    aria-hidden
    className={ellipsis({ className })}
    {...props}
  >
    <Icon icon='lucide:more-horizontal' className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)

Pagination.displayName = "Pagination"
PaginationItem.displayName = "PaginationItem"
PaginationLink.displayName = "PaginationLink"
PaginationPrevious.displayName = "PaginationPrevious"
PaginationNext.displayName = "PaginationNext"
PaginationEllipsis.displayName = "PaginationEllipsis"

namespace Type {
  export type Pagination = PaginationProps
  export type PaginationItem = PaginationItemProps
  export type PaginationLink = PaginationLinkProps
  export type PaginationPrevious = PaginationLink
  export type PaginationNext = PaginationLink
  export type PaginationEllipsis = PaginationEllipsisProps
}

export {
  paginationVariants,
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  type Type
}
