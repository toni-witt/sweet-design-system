"use client";

import type { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps } from "@radix-ui/react-collapsible"
import * as Primitive from "@radix-ui/react-collapsible"
import { casing } from "@/components/lab/uitimate/utils"

const Collapsible =
  ({ ...props }: CollapsibleProps) => (
    <Primitive.Root
      data-tag={casing.kebabCase(Collapsible.displayName)}
      {...props}
    />
  );

const CollapsibleTrigger =
  ({ ...props }: CollapsibleTriggerProps) => (
    <Primitive.CollapsibleTrigger
      data-tag={casing.kebabCase(CollapsibleTrigger.displayName)}
      {...props}
    />
  );

const CollapsibleContent =
  ({ ...props }: CollapsibleContentProps) => (
    <Primitive.CollapsibleContent
      data-tag={casing.kebabCase(CollapsibleContent.displayName)}
      {...props}
    />
  );

Collapsible.displayName = 'Collapsible'
CollapsibleTrigger.displayName = 'CollapsibleTrigger'
CollapsibleContent.displayName = 'CollapsibleContent'

namespace Type {
  export type Collapsible = CollapsibleProps
  export type CollapsibleTrigger = CollapsibleTriggerProps
  export type CollapsibleContent = CollapsibleContentProps
}

export * from "@radix-ui/react-collapsible";
export { Collapsible, CollapsibleTrigger, CollapsibleContent, type Type }
