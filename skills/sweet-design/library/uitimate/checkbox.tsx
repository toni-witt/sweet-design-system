"use client";

import { type ComponentProps } from "react"
import { Root, Indicator, type CheckedState as _CheckedState } from "@radix-ui/react-checkbox"
import { Icon } from "@/components/lab/uitimate/icon"
import { tv } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"

const checkboxVariants = tv({
  slots: {
    root: [
      "peer h-4 w-4 shrink-0",
      "rounded-sm border border-primary shadow",
      "focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
    ],
    indicator: [
      "flex items-center justify-center text-current"
    ]
  }
})
const { root, indicator } = checkboxVariants()

type CheckboxProps = ComponentProps<typeof Root> & {
  onChange?: (checked: boolean) => void
}
/**
 * #20250318
 * #1, #2
 * This is literally for supporting the integration with React-hook-form (RHF).
 * To allow RHF to control this very form element, the component must provide the standard props:
 * - value
 * - onChange
 * - onBlur
 *
 * Since Radix uses the non-standard ones, here we need to manually connect them as shown in #1 and #2.
 * Note that, #2 is special in this integration context, cuz both Radix and RHF define `value` prop,
 * the former needs it a string, but RHF will feed it a boolean.
 * This shouldn't be a problem, cuz RHF when using RHF, the needs to use the Radix `value` should be very rare,
 * and the real value of the checkbox will be fully controlled by RHF.
 *
 */
const Checkbox = ({
  className,
  onChange,
  onCheckedChange,
  ...props
}: CheckboxProps) => {
  return (
    <Root
      data-tag={casing.kebabCase(Checkbox.displayName)}
      className={root({ className })}
      {...(props.value !== undefined && { checked: !!props.value })} // #2
      onCheckedChange={(v) => {
        onChange?.(v as boolean); // #1
        onCheckedChange?.(v as boolean);
      }}
      {...props}
    >
      <CheckboxIndicator />
    </Root>
  )
}

type CheckboxIndicatorProps = ComponentProps<typeof Indicator>
const CheckboxIndicator = ({
  className,
  children,
  ...props
}: CheckboxIndicatorProps) => {
  return (
    <Indicator
      data-tag={casing.kebabCase(CheckboxIndicator.displayName)}
      className={indicator({ className })}
      {...props}
    >
      {children ?? <Icon icon="lucide:check" className="size-4" />}
    </Indicator>
  )
}

Checkbox.displayName = "Checkbox"
CheckboxIndicator.displayName = "CheckboxIndicator"

namespace Type {
  export type Checkbox = CheckboxProps
  export type CheckboxIndicator = CheckboxIndicatorProps
  export type CheckedState = _CheckedState
}

export * from "@radix-ui/react-checkbox";

export {
  type Type,
  Checkbox,
  checkboxVariants,
  CheckboxIndicator, // This is not meant to be used directly
}
