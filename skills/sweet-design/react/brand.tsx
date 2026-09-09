import Image from "next/image";

/**
 * The Sweet logo, from the real asset.
 *
 * `public/brand/sweet-logo.png` is the shipped lockup: 973×256, navy on
 * transparent. The SVGs that sat next to it (`sweet-logo.svg`,
 * `sweet-icon.svg`) were hand-drawn stand-ins — three rounded bars and the word
 * "sweet" set in a font the app never loads — so every version was showing an
 * approximation of the logo rather than the logo. These two components are the
 * only place the file is referenced now.
 *
 * `sweet-icon.png` in the kit can't be used: despite the extension it is a
 * JPEG, so the transparent ground came out solid black.
 */

const LOGO = "/brand/sweet-logo.png";

/** Intrinsic size of the lockup. */
const W = 973;
const H = 256;

/**
 * The mark's own box. The lockup's first 256×256 is exactly the S — measured
 * off the file's alpha channel, not eyeballed — which is what lets the mark be
 * cropped out of the lockup instead of shipped as a second file.
 */
const MARK = 256;

/** The full lockup: mark plus wordmark. */
export function SweetLogo({
  height = 24,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src={LOGO}
      alt="Sweet"
      className={className}
      width={Math.round((height * W) / H)}
      height={height}
      priority
      style={{ height, width: "auto" }}
    />
  );
}

/**
 * The mark alone, for a collapsed rail or a favicon-sized slot. Rendering the
 * lockup at the size we want the S and clipping everything past the first
 * square keeps one file as the source of truth for the brand.
 */
export function SweetMark({
  size = 26,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        display: "block",
        flex: "none",
        width: size,
        height: size,
        overflow: "hidden",
      }}
    >
      <Image
        src={LOGO}
        alt="Sweet"
        width={Math.round((size * W) / MARK)}
        height={size}
        priority
        style={{ height: size, width: "auto", maxWidth: "none" }}
      />
    </span>
  );
}
