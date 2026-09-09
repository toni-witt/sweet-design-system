import { type ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

/**
 * Ported from Uitimate (packages/docs/app/components/ui/Timeline), which is the
 * clearest example of its authoring convention:
 *
 *   · every part is its own exported component, no `asChild` gymnastics
 *   · every part's classes live in an exported `tv()` slot function, so a
 *     consumer can extend the variants instead of fighting them with `!important`
 *   · props are `ComponentProps<"tag"> & VariantProps<typeof variants>` — no
 *     hand-written prop interfaces to drift out of date
 *
 * Two changes on the way in: Uitimate compiles Tailwind with a `tw:` prefix,
 * which we do not, and its `Separator` is swapped for a plain <span>. The
 * `tone` variant is ours — added to show what extending one of these looks like.
 */

export const timeline = tv({
  base: "flex flex-col",
});

export const timelineItem = tv({
  base: "relative pb-5 last:pb-0",
});

export const timelineDot = tv({
  base: [
    "absolute left-0 top-1 z-10 grid size-[15px] place-items-center",
    "rounded-full border-2 bg-surface",
  ],
  variants: {
    tone: {
      neutral: "border-[var(--line-strong)]",
      ok: "border-ok",
      warn: "border-warn",
      bad: "border-bad",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export const timelineLine = tv({
  base: "absolute left-[7px] top-5 h-full w-px -translate-x-1/2 bg-[var(--line-strong)]",
});

export const timelineTitle = tv({
  base: "pl-7 text-[13px] font-medium tracking-[-0.01em] text-ink",
});

export const timelineContent = tv({
  base: "pl-7 pt-0.5 text-[12px] leading-relaxed text-muted",
});

type TimelineProps = ComponentProps<"ol"> & VariantProps<typeof timeline>;
export const Timeline = ({ className, ...props }: TimelineProps) => (
  <ol className={timeline({ className })} {...props} />
);

type TimelineItemProps = ComponentProps<"li"> & VariantProps<typeof timelineItem>;
export const TimelineItem = ({ className, ...props }: TimelineItemProps) => (
  <li className={timelineItem({ className })} {...props} />
);

type TimelineDotProps = ComponentProps<"span"> & VariantProps<typeof timelineDot>;
export const TimelineDot = ({ className, tone, ...props }: TimelineDotProps) => (
  <span aria-hidden className={timelineDot({ tone, className })} {...props} />
);

type TimelineLineProps = ComponentProps<"span">;
export const TimelineLine = ({ className, ...props }: TimelineLineProps) => (
  <span aria-hidden className={timelineLine({ className })} {...props} />
);

type TimelineTitleProps = ComponentProps<"p"> & VariantProps<typeof timelineTitle>;
export const TimelineTitle = ({ className, ...props }: TimelineTitleProps) => (
  <p className={timelineTitle({ className })} {...props} />
);

type TimelineContentProps = ComponentProps<"div"> & VariantProps<typeof timelineContent>;
export const TimelineContent = ({ className, ...props }: TimelineContentProps) => (
  <div className={timelineContent({ className })} {...props} />
);
