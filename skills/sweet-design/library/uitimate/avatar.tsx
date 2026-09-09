"use client";

import { type ComponentProps } from "react"
import { Root, Image, Fallback } from "@radix-ui/react-avatar"
import { tv } from "tailwind-variants"
import { casing } from "@/components/lab/uitimate/utils"

const avatarVariants = tv({
  slots: {
    root: ["relative h-10 w-10 block overflow-hidden rounded-full"],
    image: ["aspect-square h-full w-full"],
    fallback: ["flex h-full w-full items-center justify-center rounded-full bg-surface-2"],
  }
})
const { root, image, fallback } = avatarVariants()

type AvatarProps = Type.Avatar
const Avatar = ({
  className,
  ...props
}: AvatarProps) => {
  return (
    <Root
      data-avatar
      data-tag={casing.kebabCase(Avatar.displayName)}
      className={root({ className })}
      {...props}
    />
  )
}

type AvatarImageProps = Type.AvatarImage
const AvatarImage = ({
  className,
  children,
  ...props
}: AvatarImageProps) => {
  return (
    <Image
      data-tag={casing.kebabCase(AvatarImage.displayName)}
      className={image({ className })}
      {...props}
    />
  )
}

type AvatarFallbackProps = Type.AvatarFallback
const AvatarFallback = ({
  className,
  ...props
}: AvatarFallbackProps) => {
  return (
    <Fallback
      data-tag={casing.kebabCase(AvatarFallback.displayName)}
      className={fallback({ className })}
      {...props}
    />
  )
}

Avatar.displayName = "Avatar"
AvatarImage.displayName = "AvatarImage"
AvatarFallback.displayName = "AvatarFallback"

namespace Type {
  export type Avatar = ComponentProps<typeof Root>
  export type AvatarImage = ComponentProps<typeof Image>
  export type AvatarFallback = ComponentProps<typeof Fallback>
}

export * from "@radix-ui/react-avatar";

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  avatarVariants,
  type Type
}
