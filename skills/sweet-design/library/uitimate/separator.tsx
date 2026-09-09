"use client";

import { type ComponentProps } from "react"
import { Root } from "@radix-ui/react-separator"
import { tv, type VariantProps } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"

const separatorVariants = tv({
  base: [
    "shrink-0 bg-border"
  ],
  variants: {
    orientation: {
      horizontal: "h-[1px] w-full",
      vertical: "h-full w-[1px]"
    }
  },
  defaultVariants: {
    orientation: "horizontal"
  }
})

type SeparatorProps = ComponentProps<typeof Root> & VariantProps<typeof separatorVariants>
const Separator = ({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) => {
  return (
    <Root
      data-tag={casing.kebabCase(Separator.displayName)}
      decorative={decorative}
      orientation={orientation}
      className={separatorVariants({ orientation, className })}
      {...props}
    />
  )
}

Separator.displayName = "Separator"

namespace Type {
  export type Separator = SeparatorProps
}

export * from "@radix-ui/react-separator"
export {
  Separator,
  type Type
}