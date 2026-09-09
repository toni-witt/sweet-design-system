"use client";

import { type ComponentProps } from "react"
import { Root, Thumb } from "@radix-ui/react-switch"
import { tv } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"

const switchVariants = tv({
  slots: {
    root: [
      "ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent shadow-xs transition-[color,box-shadow]",
      "focus-visible:ring-4 focus-visible:outline-hidden focus-visible:outline-1",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-invalid:focus-visible:ring-0",
      "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
    ],
    thumb: [
      "bg-background pointer-events-none block size-4 rounded-full ring-0 shadow-lg transition-transform",
      "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
    ]
  }
})
const { root, thumb } = switchVariants()

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
type SwitchProps = ComponentProps<typeof Root> & { onChange?: (checked: boolean) => void }
const Switch = ({
  className,
  onChange,
  onCheckedChange,
  ...props
}: SwitchProps) => {
  return (
    <Root
      data-tag={casing.kebabCase(Switch.displayName)}
      className={root({ className })}
      {...(props.value !== undefined && { checked: !!props.value })} // #2
      onCheckedChange={(v) => {
        onChange?.(v as boolean); // #1
        onCheckedChange?.(v as boolean);
      }}
      {...props}
    >
      <Thumb className={thumb()} />
    </Root>
  )
}

Switch.displayName = 'Switch'

namespace Type {
  export type Switch = SwitchProps
}

export * from "@radix-ui/react-switch"
export {
  type Type,
  switchVariants,
  Switch,
}