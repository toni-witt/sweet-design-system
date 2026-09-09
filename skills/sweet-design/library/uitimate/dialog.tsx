"use client";

import React, { Children, createContext, useContext, type ComponentProps } from 'react'
import { Dialog as DialogRoot, DialogPanel as DialogContent, DialogTitle as Title, Description as DialogDescription, DialogBackdrop as DialogOverlay, CloseButton as DialogClose } from '@headlessui/react'
import { tv, type VariantProps } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"
import { Icon } from '@/components/lab/uitimate/icon'
import { Cta } from "@/components/lab/uitimate/cta"
import { headingVariants, type HeadingSubtitle, HeadingContext } from '@/components/lab/uitimate/heading'

const dialogVariants = tv({
  slots: {
    root: 'relative z-10 focus:outline-none',
    overlay: "fixed inset-0 bg-black/80",
    content: [
      "min-w-[320px] w-screen h-screen md:h-auto md:max-w-lg space-y-4 p-6",
      "md:rounded-lg bg-background relative dark:md:border",
      "flex flex-col",
      "fixed top-2/4 left-2/4 translate-x-[-50%] translate-y-[-50%]",
      "z-50" // make sure it's above the overlay, see #2504151
    ],
    action: [
      "mt-auto",
      "flex flex-col-reverse sm:flex-row sm:justify-end",
      "space-y-reverse space-y-2 sm:space-x-2 sm:space-y-0"
    ],
  }
})
const { root, overlay, content, action } = dialogVariants()
const { root: headingRoot, title, subtitle } = headingVariants()

/**
 * - `implicit`: currently only 2 cases, 1) pressing the `Escape` key, 2) clicking outside the dialog
 * - `x`: meaning the x-symbol icon button is clicked
 */
type CloseSource = { from: 'implicit' | 'x' };
type BaseDialogProps = Omit<ComponentProps<typeof DialogRoot>, 'open' | 'onClose'> & {
  children: React.ReactNode;
  open: boolean;
};
type AlertDialogProps = BaseDialogProps & { role: 'alertdialog'; onClose?: (details: CloseSource) => void; };
type StandardDialogProps = BaseDialogProps & {
  role?: Exclude<ComponentProps<typeof DialogRoot>['role'], 'alertdialog'>;
  onClose: (details: CloseSource) => void;
};
type DialogProps = AlertDialogProps | StandardDialogProps;

const Dialog = ({ className, children, open, onClose, ...props }: DialogProps) => {
  const isAlert = props.role === 'alertdialog';
  // This aligns the dialog definition: when it's an alert, only the most explicit action can dismiss/proceed the dialog
  const handleClose = () => !isAlert && onClose?.({ from: 'implicit' })
  return (
    <DialogRoot
      open={open}
      onClose={handleClose}
      className={root()}
      data-tag={casing.kebabCase(Dialog.displayName)}
      role={isAlert ? 'alertdialog' : 'dialog'}
      {...props}
    >
      <DialogContent className={content({ className })}>
        <DialogContext.Provider value={{ isAlert, onClose }}>
          {children}
        </DialogContext.Provider>
      </DialogContent>
      {/*
        #2504151
        the only reason to make this as the DialogContent's next sibling is just allowing
        the consumer to hide the overlay via Tailwind, so that we don't need to create another prop just for this matter.
      */}
      <DialogOverlay
        data-tag={casing.kebabCase(DialogOverlay.displayName)}
        className={overlay()}
      />
    </DialogRoot>
  )
}

const DialogContext = createContext<{
  isAlert: boolean;
  onClose: ((details: CloseSource) => void) | undefined
}>({
  isAlert: false,
  onClose: undefined
})

type DialogActionProps = ComponentProps<'div'>
const DialogAction = ({
  className,
  ...props
}: DialogActionProps) => (
  <div
    className={action({ className })}
    data-tag={casing.kebabCase(DialogAction.displayName)}
    {...props}
  />
)

/**
 * Design note:
 * - The reason we re-implement the `Heading` family components in Dialog
 *   is mainly becauses the better integration with the native <Title> and <Description>
 *   provided by HeadlessUI.
 * - ARIA expectation: to keep accessibility friendly and keep the code clean,
 *   the balance is we'll only apply `aria-describedby` in `DialogSubtitle` and it'd be in certain style.
 */
type DialogHeadingProps = ComponentProps<'div'> & VariantProps<typeof headingVariants>
const DialogHeading = ({ size = 'h4', children, className, ...props }: DialogHeadingProps) => {
  let content = children
  if (Children.count(children) === 1) {
    if (
      typeof children === 'string' || // this is when passing a literal string
      typeof (children as any)?.type === 'string' // this is when passing a native element (eg., span)
    ) {
      content = <DialogTitle>{children}</DialogTitle> // Normalization
    } else {
      // Possible cases (should all be extreme rare):
      // 1. only <DialogTitle> or <DialogSubtitle> is specified
      // 2. <DialogTitle> or <DialogSubtitle> in another element
      throw new Error('Invalid children provided to DialogHeading')
    }
  }
  return (
    <HeadingContext.Provider value={{ size }}>
      <div
        {...props}
        className={headingRoot({ size, className })}
        data-tag={casing.kebabCase(DialogHeading.displayName)}
      >
        {content}
      </div>
    </HeadingContext.Provider>
  )
}

type DialogTitleProps = ComponentProps<typeof Title>
const DialogTitle = ({ className, children, ...props }: DialogTitleProps) => {
  const { size } = useContext(HeadingContext);
  const { isAlert, onClose } = useContext(DialogContext);
  return (
    <Title
      className={title({ size, className })}
      data-tag={casing.kebabCase(DialogTitle.displayName)}
      {...props}
    >
      {typeof children === 'function' ? children : (
        <>
          {children}
          {!isAlert && (
            <Cta
              data-tag={casing.kebabCase(DialogClose.displayName)}
              variant="ghost"
              size="sm"
              shapes={['icon']}
              className="absolute right-0 top-0 rounded-full opacity-70 ring-offset-background data-hover:opacity-100"
              onClick={() => onClose?.({ from: 'x' })}
            >
              <Icon icon="lucide:x" />
              <span className="sr-only">Close</span>
            </Cta>
          )}
        </>
      )}
    </Title>
  )
}

type DialogSubtitleProps = ComponentProps<typeof HeadingSubtitle>
const DialogSubtitle = ({ className, children, ...props }: DialogSubtitleProps) => {
  const { size } = useContext(HeadingContext);
  return (
    <DialogDescription
      className={subtitle({ size, className })}
      data-tag={casing.kebabCase(DialogSubtitle.displayName)}
      {...props}
    >
      {children}
    </DialogDescription>
  )
}

Dialog.displayName = 'Dialog'
DialogAction.displayName = 'DialogAction'
DialogHeading.displayName = 'DialogHeading'
DialogTitle.displayName = 'DialogTitle'
DialogSubtitle.displayName = 'DialogSubtitle'
DialogClose.displayName = 'DialogClose'
DialogContent.displayName = 'DialogContent'
DialogOverlay.displayName = 'DialogOverlay'

namespace Type {
  export type Dialog = DialogProps;
  export type DialogAction = DialogActionProps;
  export type DialogHeading = DialogHeadingProps;
  export type DialogTitle = DialogTitleProps;
  export type DialogSubtitle = DialogSubtitleProps;
  export type CloseSource = { from: 'implicit' | 'x' };
}

export * from "@headlessui/react";
export {
  type Type,
  dialogVariants,
  Dialog,
  DialogAction,
  DialogHeading,
  DialogTitle,
  DialogSubtitle,
  /**
   * These should be rare to be used, but exported anyway in case there're some edge cases.
  */
  DialogClose, // Not recommended to be used, cuz it can be confusing from the definition of HeadlessUI
  DialogContent,
  DialogOverlay, // This is not suppose to be used directly, cuz it has been included by default in `Dialog`
  DialogDescription, // This is not suppose to be used directly; in most of time, just use `DialogSubtitle`
}

