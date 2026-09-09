# Brand assets

## Use this one

**`sweet-logo.png`** — 973×256, navy on transparent. The full lockup: mark plus
wordmark. Its first 256×256 is exactly the S, measured off the alpha channel,
which is what lets `react/brand.tsx` crop the mark out of the lockup instead of
shipping a second file. One file, one source of truth.

```tsx
<SweetLogo height={22} />   // lockup, in a rail or a header
<SweetMark size={26} />     // the S alone, collapsed rail or avatar-sized slot
```

## Do not use

**`sweet-icon-JPEG-DO-NOT-USE.png`** — despite the extension this is a JPEG, so
the transparent ground was flattened to solid black. It cannot go on a light
background. Kept only so nobody re-discovers it in the original kit and wastes
an hour.

The SVGs that shipped in `design-kit/assets/` (`sweet-logo.svg`,
`sweet-icon.svg`, `sweet-logo-light.svg`) are **not the logo** — they are
hand-drawn stand-ins, three rounded bars plus the word "sweet" set in a font the
app never loads. Do not use them.

## Still needed

- A real vector export of the mark and lockup (SVG), for print, favicons and
  anything that scales past 256px.
- A light-on-dark variant, once dark mode is decided.
- Favicon and app-icon sizes.
- Clear-space and minimum-size rules.
