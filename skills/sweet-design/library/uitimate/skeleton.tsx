"use client";

import { type ComponentProps } from "react"
import { tv, type VariantProps } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"

const skeletonVariants = tv({
  base: "animate-pulse rounded-md bg-primary/10",
})

type SkeletonProps = ComponentProps<"div"> & VariantProps<typeof skeletonVariants>
const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div
    className={skeletonVariants({ className })}
    data-tag={casing.kebabCase(Skeleton.displayName)}
    {...props}
  />
)

Skeleton.displayName = 'Skeleton'

namespace Type {
  export type Skeleton = SkeletonProps
}

export {
  Skeleton,
  skeletonVariants,
  type Type
}
