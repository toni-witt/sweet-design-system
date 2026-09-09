# Vendored component source

Copied from `src/components/lab/*` so this folder stands on its own. See
`../COMPONENTS.md` for what each set is good for and which to prefer.

| Folder | Built on | Count | Verdict |
|---|---|---|---|
| `uitimate/` | Radix + tailwind-variants (shadcn lineage) | 36 | Good. Take the behaviour, give it our classes. `switch` and `pagination` are the two we've adopted outright. |
| `magicui/` | motion + Tailwind | 8 | Mostly marketing. Three are product-safe; the rest are decoration this system removed. |
| `dotmatrix/` | CSS + hooks | 6 | Loaders. Unadopted — the loading-state question is still open. |

Not vendored, because they are ordinary npm packages: `@base-ui/react` (the
default for anything with behaviour), `cmdk`, `motion`, `recharts`, `sonner`,
`@number-flow/react`, `react-virtuoso`, `zustand`, `shiki`, `@dnd-kit/*`,
`input-otp`, `lucide-react`, `cobe`.

## A warning about theming

The `uitimate` set is written against shadcn token names — `bg-primary`,
`border-border`, `text-foreground`. In this repo `src/app/globals.css` bridges
those onto the app's own tokens, so the components arrive roughly on-palette.
Outside this repo they will not.

Either port the bridge, or do what we do: let the component supply behaviour and
markup, and give it a class from `patterns.css` that out-specifies its Tailwind
classes. That is one line per component and it never drifts.
