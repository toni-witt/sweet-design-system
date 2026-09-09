"use client";

import "./progress.css"
import { type ComponentProps } from "react"
import { Root, Indicator } from "@radix-ui/react-progress"
import { tv } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"

const progressVariants = tv({
  slots: {
    root: [
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20"
    ],
    indicator: [
      "h-full bg-primary transition-all"
    ]
  },
  variants: {
    indeterminate: {
      true: {
        indicator: "absolute w-[40%] left-0 animate-[progress-indeterminate_1.4s_ease_infinite]"
      },
    }
  }
})

type ProgressProps = ComponentProps<typeof Root> & {
  indeterminate?: boolean
}

const Progress = ({
  className,
  value,
  indeterminate,
  ...props
}: ProgressProps) => {
  const { root, indicator } = progressVariants({ indeterminate })

  return (
    <Root
      data-tag={casing.kebabCase(Progress.displayName)}
      className={root({ className })}
      {...props}
    >
      <Indicator
        className={indicator()}
        style={!indeterminate ? {
          transform: `translateX(-${100 - (value || 0)}%)`
        } : undefined}
      />
    </Root>
  )
}

Progress.displayName = 'Progress'

namespace Type {
  export type Progress = ProgressProps
}

export * from "@radix-ui/react-progress"
export {
  Progress,
  progressVariants,
  type Type
}