"use client";

import { Slot } from "@/components/lab/uitimate/slot";
import { createContext, useContext, type ComponentProps, type CSSProperties } from "react";
import { tv } from "tailwind-variants";
import { casing } from "@/components/lab/uitimate/utils"

const ListLevelContext = createContext(0);

/**
 * WARN: Do not provide non-minimal default styles, cuz it'd definitely hurt DX in some cases, and that has been proven from the experience.
 */
const listVariants = tv({
  base: 'flex flex-col ml-(--indent-margin) pl-(--indent-padding)',
});
type ListProps = ComponentProps<'div'> & { asChild?: boolean, indentMargin?: number, indentPadding?: number }
/**
 * The major thing that this component is doing is that when List is placed inside ListItem,
 * such List will be indented, so it renders a nested style listing,
 * and the deeper the nested level, the more the indent.
 */
const List = ({
  className,
  asChild = false,
  /**
   * The tip to setup this value is breaking them down together in logic.
   * eg., if reducing `indentMargin` to half, then it's suggested to also do the same on another one.
   */
  indentMargin = 20,
  indentPadding = 12,
  ...props
}: ListProps) => {
  const level = useContext(ListLevelContext);
  const Comp = asChild ? Slot : 'div'
  return (
    <ListLevelContext.Provider value={level + 1}>
      <Comp
        data-tag={casing.kebabCase(List.displayName)}
        data-level={level}
        className={listVariants({ className })}
        style={{
          // the mixup of margin and padding is to support the "left-side-border" style of the nested list
          '--indent-margin': `${level * indentMargin}px`,
          '--indent-padding': `${level ? indentPadding : 0}px`,
        } as CSSProperties}
        {...props}
      />
    </ListLevelContext.Provider>
  )
}

/**
 * WARN: Do not provide non-minimal default styles, cuz it'd definitely hurt DX in some cases, and that has been proven from the experience.
 */
const listItemVariants = tv({
  base: [
    'gap-2 flex items-center',
    /**
     * Design Note:
     * Below setup seems still work perfectly in our policy of "the direct child of List will only be ListItem" in many UI cases,
     * so far, it never failed.
     */
    'has-data-[tag=list]:gap-0 has-data-[tag=list]:flex-col has-data-[tag=list]:items-stretch',
  ],
});
type ListItemProps = ComponentProps<'div'> & { asChild?: boolean }
const ListItem = ({
  className,
  asChild = false,
  ...props
}: ListItemProps) => {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      data-tag={casing.kebabCase(ListItem.displayName)}
      className={listItemVariants({ className })}
      {...props}
    />)
}

List.displayName = 'List'
ListItem.displayName = 'ListItem'

namespace Type {
  export type List = ListProps;
  export type ListItem = ListItemProps;
}

export {
  type Type,
  listVariants,
  listItemVariants,
  List,
  ListItem,
}