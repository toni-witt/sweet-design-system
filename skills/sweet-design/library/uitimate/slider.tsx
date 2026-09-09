"use client";

import { type ComponentProps } from "react"
import { Root, Track, Range, Thumb } from "@radix-ui/react-slider"
import { tv } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"

const sliderVariants = tv({
  slots: {
    root: [
      "touch-none select-none items-center relative flex w-full",
    ],
    track: [
      "bg-primary/20 overflow-hidden rounded-full relative h-1.5 w-full grow",
    ],
    range: [
      "absolute h-full bg-primary"
    ],
    thumb: [
      "bg-background shadow transition-colors rounded-full border border-primary/50 block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors",
      "focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50"
    ]
  }
})
const { root, track, range, thumb } = sliderVariants()

type SliderTrackProps = ComponentProps<typeof Track>
const SliderTrack = ({
  className,
  children,
  ...props
}: SliderTrackProps) => {
  return (
    <Track
      className={track({ className })}
      data-tag={casing.kebabCase(SliderTrack.displayName)}
      {...props}
    >
      {children}
    </Track>
  )
}

type SliderRangeProps = ComponentProps<typeof Range>
const SliderRange = ({
  className,
  ...props
}: SliderRangeProps) => {
  return (
    <Range
      className={range({ className })}
      data-tag={casing.kebabCase(SliderRange.displayName)}
      {...props}
    />
  )
}

type SliderThumbProps = ComponentProps<typeof Thumb>
const SliderThumb = ({
  className,
  ...props
}: SliderThumbProps) => {
  return (
    <Thumb
      className={thumb({ className })}
      data-tag={casing.kebabCase(SliderThumb.displayName)}
      {...props}
    />
  )
}

type SliderProps = ComponentProps<typeof Root>
const Slider = ({
  className,
  ...props
}: SliderProps) => {
  return (
    <Root
      className={root({ className })}
      data-tag={casing.kebabCase(Slider.displayName)}
      {...props}
    >
      <SliderTrack><SliderRange /></SliderTrack>
      <SliderThumb />
    </Root>
  )
}

Slider.displayName = 'Slider'
SliderTrack.displayName = 'SliderTrack'
SliderRange.displayName = 'SliderRange'
SliderThumb.displayName = 'SliderThumb'

namespace Type {
  export type Slider = SliderProps;
  export type SliderTrack = SliderTrackProps;
  export type SliderRange = SliderRangeProps;
  export type SliderThumb = SliderThumbProps;
}

export * from "@radix-ui/react-slider"
export {
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
  sliderVariants,
  type Type
}