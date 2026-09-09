"use client";

import { type ComponentProps } from "react"
import { tv } from "tailwind-variants"
import { Textarea as TextareaPrimitive } from '@headlessui/react'
import { casing } from '@/components/lab/uitimate/utils'

const textareaVariants = tv({
  base: [
    "flex field-sizing-content min-h-16 w-full",
    "px-3 py-2 text-base md:text-sm rounded-md border bg-transparent",
    "border-input shadow-xs transition-[color,box-shadow]",

    "placeholder:text-muted-foreground",
    "outline-ring/50 dark:outline-ring/40 ring-ring/10 dark:ring-ring/20",

    "focus-visible:ring-4 focus-visible:outline-1 hover:shadow",
    "disabled:cursor-not-allowed disabled:opacity-50",

    "aria-invalid:border-destructive/60 dark:aria-invalid:border-destructive",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/50",
    "aria-invalid:outline-destructive/60 dark:aria-invalid:outline-destructive",
    "aria-invalid:focus-visible:ring-[3px] dark:aria-invalid:focus-visible:ring-4",
    "aria-invalid:focus-visible:outline-none"
  ]
})

type TextareaProps = ComponentProps<typeof TextareaPrimitive> & ComponentProps<'textarea'>
const Textarea = ({
  className,
  ...props
}: TextareaProps) => {
  return (
    <TextareaPrimitive
      data-tag={casing.kebabCase(Textarea.displayName)}
      className={textareaVariants({ className })}
      {...props}
    />
  )
}

Textarea.displayName = 'Textarea'

namespace Type {
  export type Textarea = TextareaProps;
}

export * from "@headlessui/react"
export {
  type Type,
  Textarea,
  textareaVariants
}
