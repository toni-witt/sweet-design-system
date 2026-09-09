"use client";

import { useState, type ComponentProps } from "react"
import { Toggle } from "@radix-ui/react-toggle"
import { Slot } from "@/components/lab/uitimate/slot";
import { Primitive } from '@radix-ui/react-primitive';
import {
  tv,
  type VariantProps,
} from 'tailwind-variants';
import { casing } from "@/components/lab/uitimate/utils"

const baseStyle = [
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors data-hover:cursor-pointer",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "[&_[data-icon]]:size-4 [&_[data-icon]]:shrink-0",
  'data-[state=on]:ring-2 data-[state=on]:ring-primary/50' // "Toggle" style
]
const primaryBaseStyle = [
  "bg-primary text-primary-foreground",
  "data-hover:bg-primary/80"
]
const secondaryBaseStyle = [
  "bg-secondary text-secondary-foreground",
  "data-hover:bg-secondary/50"
]
const destructiveBaseStyle = [
  "bg-destructive text-destructive-foreground",
  "data-hover:bg-destructive/80"
]
const outlineBaseStyle = [
  "bg-background text-foreground",
  "data-hover:bg-secondary"
]
const ghostBaseStyle = [
  "bg-background text-foreground",
  "data-hover:bg-secondary",
  "data-[state=on]:ring-0! data-[state=on]:bg-surface-2" // "Toggle" style
]
const linkBaseStyle = [
  "underline-offset-4",
  "text-primary",
  "data-hover:underline"
]

const buttonVariants = tv({
  base: baseStyle,
  variants: {
    variant: {
      primary: ["shadow", ...primaryBaseStyle],
      secondary: ["shadow-sm", ...secondaryBaseStyle],
      destructive: ["shadow-sm", ...destructiveBaseStyle],
      outline:
        [
          "shadow-sm",
          "border border-secondary", // TODO: why not use outline?
          ...outlineBaseStyle
        ],
      ghost: ghostBaseStyle,
      link: linkBaseStyle
    },
    mode: {
      icon: ["p-0! aspect-square"],
    },
    size: {
      sm: "text-sm h-9 px-3 [&_[data-icon]]:size-[0.865rem]",
      md: "text-base h-10 px-4 [&_[data-icon]]:size-[1rem]",
      lg: "text-lg h-11 px-8 [&_[data-icon]]:size-[1.125rem]",
    }
  },
  compoundVariants: [
    {
      mode: 'icon',
      size: 'sm',
      class: 'w-9',
    },
    {
      mode: 'icon',
      size: 'md',
      class: 'w-10',
    },
    {
      mode: 'icon',
      size: 'lg',
      class: 'w-11',
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})

const badgeVariants = tv({
  base: baseStyle,
  variants: {
    variant: {
      primary: primaryBaseStyle,
      secondary: secondaryBaseStyle,
      destructive: destructiveBaseStyle,
      outline: ["outline", ...outlineBaseStyle],
      ghost: ghostBaseStyle,
      link: linkBaseStyle
    },
    mode: {
      icon: ["p-0! aspect-square"],
    },
    size: {
      sm: 'text-xs px-2.5 py-0.5  [&_[data-avatar]]:size-5 [&_[data-icon]]:size-[0.75rem]',
      md: 'text-sm px-3 py-0.5 [&_[data-avatar]]:size-6 [&_[data-icon]]:size-[0.865rem]',
      lg: 'text-base px-3.5 py-0.5  [&_[data-avatar]]:size-7 [&_[data-icon]]:size-[1rem]'
    }
  },
  compoundVariants: [
    {
      mode: 'icon',
      size: 'sm',
      class: 'size-5',
    },
    {
      mode: 'icon',
      size: 'md',
      class: 'size-6',
    },
    {
      mode: 'icon',
      size: 'lg',
      class: 'size-7',
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})

type CtaProps = (
  ComponentProps<typeof Primitive.button> &
  Omit<VariantProps<typeof buttonVariants>, 'mode'> &
  {
    muted?: boolean;
    unpressedOnBlur?: boolean;
    wontUnpressedOnClick?: boolean;
    shapes?: ('badge' | 'icon')[];
    asChild?: boolean;
    // Below are major props of Radix's Toggle
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
  }
)

const Cta =
  ({
    variant, size, shapes = [], muted = false,
    // It's no harm to always use type = button even it's not really actally a button
    // but it's important to set this to `submit` to work with form properly
    type = 'button',
    unpressedOnBlur = false,
    onBlur,
    onPressedChange,
    wontUnpressedOnClick = false,
    className, children, asChild = false, ...props
  }: CtaProps) => {
    const [toggled, setToggled] = useState(props.defaultPressed)
    if (shapes.length > 2) {
      throw new Error('`shapes` currently only can have up to 2 elements')
    }
    const shouldTreatAsToggle = props.pressed !== undefined || props.defaultPressed !== undefined || onPressedChange !== undefined
    const Comp = muted ? 'span' : (shouldTreatAsToggle ? Toggle : (asChild ? Slot : Primitive.button))
    const isBadgeStyle = shapes.includes('badge')
    const mode = shapes.find((s: any) => s !== 'badge') as 'icon' | undefined
    return <Comp
      type={type}
      data-tag={casing.kebabCase(Cta.displayName)}
      data-disabled={props.disabled ? '' : undefined}
      onMouseEnter={(e) => !muted && (e.currentTarget.dataset.hover = '')}
      onMouseLeave={(e) => delete e.currentTarget.dataset.hover}
      className={isBadgeStyle ?
        badgeVariants({ variant, size, mode, className }) :
        buttonVariants({ variant, size, mode, className })
      }
      /**
       * It should be no such use case: passing both `pressed` and `unpressedOnBlur` at the same time.
       */
      {...(shouldTreatAsToggle && {
        pressed: toggled,
        onPressedChange: (e: boolean) => {
          if (!e && wontUnpressedOnClick) return onPressedChange?.(e)
          setToggled(e)
          onPressedChange?.(e)
        },
      })}
      onBlur={e => (unpressedOnBlur && setToggled(false), onBlur?.(e))}
      {...props}
    >
      {children}
    </Comp>
  }

Cta.displayName = "Cta"

namespace Type {
  export type Cta = CtaProps;
  export type Toggle = ComponentProps<typeof Toggle>;
}

// Igore to export '@radix-ui/react-primitive', cuz it should be super rare to be useful,
// plus, exporting that will conflict with the the export of "@radix-ui/react-toggle"
export * from "@radix-ui/react-toggle";
export {
  Cta,
  buttonVariants,
  badgeVariants,
  type Type
}