# Sweet design system

One repo. One copy of every rule and every token. Consumed two ways:

- **As a Claude Code plugin** — so any engineer's agent follows the brand
  without being told to.
- **As an npm package** — so the CSS and components are *installed*, not
  copied.

Both read the same files on disk. There is no build step and no second copy,
which is the entire point: the moment `patterns.css` exists in two repos, you
have two design systems.

```
.claude-plugin/          plugin + marketplace manifests
skills/sweet-design/     ← everything lives here, once
  SKILL.md               the router the agent loads first
  INDEX.md               human entry point
  PRINCIPLES.md          the language, and the reasoning
  COMPONENTS.md          which library for what
  MOTION.md              how to animate, and when not to
  CHARTS.md              navy and greys
  MARKETING.md           where the rules loosen
  OPEN-QUESTIONS.md      what isn't decided yet
  tokens.css             colour, type, spacing, shape, motion
  patterns.css           every component shape
  react/                 primitives, icons, brand
  library/               vendored component source
  assets/                logo
package.json             npm exports point into skills/sweet-design/
```

---

## For engineers: install it once per repo

Add to the repo's `.claude/settings.json` and every agent that opens the repo
gets it automatically — no per-person setup, no one forgetting:

```json
{
  "extraKnownMarketplaces": {
    "sweet": { "source": { "source": "github", "repo": "toni-witt/sweet-design-system" } }
  },
  "enabledPlugins": { "sweet-design@sweet": true }
}
```

Commit that file. That is the whole integration.

Manually, or to try it:

```bash
claude plugin marketplace add toni-witt/sweet-design-system
claude plugin install sweet-design@sweet
```

### The code

```bash
npm i @toni-witt/sweet-design
```

```tsx
import "@toni-witt/sweet-design/tokens.css";
import "@toni-witt/sweet-design/patterns.css";
import { Segmented, useHeightFloor } from "@toni-witt/sweet-design/react/primitives";
```

The docs ship inside the package too, so an agent in a repo that has it
installed can read them from `node_modules` with no network.

---

## Changing it

**Every change lands here first.** A rule that only exists in a feature repo is
not a rule, it's a local variant, and in three months it is a third design
system.

1. Change the file here. If it's a new rule, write the reasoning with it —
   `PRINCIPLES.md` is useful precisely because it says *why*, which is what
   tells the next person what to do in the case that isn't listed.
2. Bump the version in `package.json` **and** `.claude-plugin/plugin.json`.
   They must agree; `claude plugin tag` validates that they do.
3. Note it in `CHANGELOG.md`.
4. `claude plugin validate .` then push. Consumers pick the plugin up with
   `claude plugin update sweet-design`, and the package with a normal bump.

### Versioning

- **Patch** — wording, a clarification, a new example.
- **Minor** — a new pattern or token; nothing existing changes meaning.
- **Major** — a rule reverses, or a token changes value. Say what to do about
  existing screens in the changelog; a major that doesn't is how a system
  becomes optional.

---

## Where drift comes from, in order of likelihood

1. **Someone copies `patterns.css` into a repo "just to tweak one thing".**
   That tweak is a new rule. It belongs here, or it belongs in that feature's
   own stylesheet as a documented exception — never as an edited copy.
2. **The vendored `library/` folder.** These are snapshots of third-party
   components (Radix/shadcn, magicui, dotmatrix). They exist so this repo stands
   alone, but upstream will move. Treat them as read-only and re-vendor
   deliberately; the npm package does not export them.
3. **The reference implementation.** v9 in the mocks repo is where every rule
   here was decided. When the two disagree, work out which is right and fix the
   other one the same day.
4. **Marketing.** It has more freedom by design, which makes it the easiest
   place for a second palette or a second type scale to appear. The four things
   it may not change are listed at the top of `MARKETING.md`.
