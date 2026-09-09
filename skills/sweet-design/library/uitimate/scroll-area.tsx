"use client";

import { type ComponentProps } from "react"
import { Root, Viewport, Corner, Scrollbar, Thumb } from "@radix-ui/react-scroll-area"
import { tv } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"

const scrollAreaVariants = tv({
  slots: {
    root: "relative overflow-hidden",
    viewport: "h-full w-full rounded-[inherit]",
  }
})
const { root, viewport } = scrollAreaVariants()

type ScrollAreaProps = ComponentProps<typeof Root>
const ScrollArea = ({
  className,
  children,
  ...props
}: ScrollAreaProps) => (
  <Root
    data-tag={casing.kebabCase(ScrollArea.displayName)}
    className={root({ className })}
    {...props}
  >
    <Viewport className={viewport()}>{children}</Viewport>
    <ScrollAreaScrollBar />
    <Corner />
  </Root>
)

const scrollBarVariants = tv({
  slots: {
    scrollbar: "flex touch-none select-none transition-colors",
    thumb: "relative flex-1 rounded-full bg-border"
  },
  variants: {
    orientation: {
      vertical: {
        scrollbar: "h-full w-2.5 border-l border-l-transparent p-[1px]",
      },
      horizontal: {
        scrollbar: "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      }
    }
  }
})
type ScrollAreaScrollBarProps = ComponentProps<typeof Scrollbar>
const ScrollAreaScrollBar = ({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaScrollBarProps) => {
  const { scrollbar, thumb } = scrollBarVariants({ orientation })
  return (
    <Scrollbar
      data-tag={casing.kebabCase(ScrollAreaScrollBar.displayName)}
      orientation={orientation}
      className={scrollbar({ className })}
      {...props}
    >
      {/*
      Design Note:
        "Thumb" is literally a small draggable widget that
        being used to drag-to-scroll on the scroll bar area
      */}
      <Thumb className={thumb()} />
    </Scrollbar>
  )
}

type ScrollAreaViewportProps = ComponentProps<typeof Viewport>
const ScrollAreaViewport = ({
  className,
  ...props
}: ScrollAreaViewportProps) => (
  <Viewport
    data-tag={casing.kebabCase(ScrollAreaViewport.displayName)}
    className={viewport({ className })}
    {...props}
  />
)

type ScrollAreaCornerProps = ComponentProps<typeof Corner>
const ScrollAreaCorner = ({
  className,
  ...props
}: ScrollAreaCornerProps) => (
  <Corner
    data-tag={casing.kebabCase(ScrollAreaCorner.displayName)}
    className={className}
    {...props}
  />
)

ScrollArea.displayName = "ScrollArea"
ScrollAreaScrollBar.displayName = "ScrollAreaScrollBar"
ScrollAreaViewport.displayName = "ScrollAreaViewport"
ScrollAreaCorner.displayName = "ScrollAreaCorner"

namespace Type {
  export type ScrollArea = ScrollAreaProps;
  export type ScrollAreaScrollBar = ScrollAreaScrollBarProps;
  export type ScrollAreaViewport = ScrollAreaViewportProps;
  export type ScrollAreaCorner = ScrollAreaCornerProps;
}

export * from "@radix-ui/react-scroll-area"
export {
  type Type,
  scrollAreaVariants,
  scrollBarVariants,
  ScrollArea,
  ScrollAreaScrollBar,
  /**
   * These should be rare to be used, but exported anyway in case there're some edge cases.
   */
  ScrollAreaViewport,
  ScrollAreaCorner
}

