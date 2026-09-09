"use client";

import { type ComponentProps } from "react"
import { tv } from "tailwind-variants"
import { Input as Primitive } from '@headlessui/react'
import { casing } from "@/components/lab/uitimate/utils"

const inputVariants = tv({
  base: [
    // File input specific styles
    "file:text-foreground file:inline-flex file:pr-4 file:h-7",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",

    // Base styles
    "flex h-10 w-full min-w-0 rounded-md", // h = 10 align with default button size
    "border border-input bg-transparent",
    "px-3 py-1 text-base md:text-sm shadow-xs",
    "transition-[color,box-shadow]",

    // Text selection and placeholder
    "placeholder:text-muted-foreground",
    "selection:bg-primary selection:text-primary-foreground",

    // Ring and outline styles
    "ring-ring/10 dark:ring-ring/20",
    "outline-ring/50 dark:outline-ring/40",

    // Invalid state styles
    "aria-invalid:outline-destructive/60 dark:aria-invalid:outline-destructive",
    "aria-invalid:border-destructive/60 dark:aria-invalid:border-destructive",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "dark:aria-invalid:ring-destructive/50",

    // Focus styles
    "focus-visible:ring-4 focus-visible:outline-1",
    "aria-invalid:focus-visible:ring-[3px] aria-invalid:focus-visible:outline-none",
    "dark:aria-invalid:focus-visible:ring-4",

    // Disabled state
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
  ]
})

type InputProps = ComponentProps<"input"> & ComponentProps<typeof Primitive>
const Input = ({
  className,
  ...props
}: InputProps) => (
  <Primitive
    data-tag={casing.kebabCase(Input.displayName)}
    data-slot="input"
    className={inputVariants({ className })}
    {...props}
  />
)

Input.displayName = "Input"

namespace Type {
  export type Input = InputProps
}

export * from "@headlessui/react";
export {
  type Type,
  inputVariants,
  Input
}