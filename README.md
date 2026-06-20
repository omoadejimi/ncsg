# Nigerian Content Style Guide (NCSG)

> Write for Nigeria. Design for everyone.

An open-source content style guide helping teams create clear, inclusive and
accessible digital experiences for Nigerian users. Inspired by the usability
of the GOV.UK Content Style Guide, with its own identity rooted in Nigeria's
digital ecosystem.

**Live stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · MDX

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static production build
```

Deploy to Vercel with zero configuration: import the repository, accept the
defaults. Every documentation page is statically generated at build time.

After deploying, update `src/lib/site.ts` with your production URL and GitHub
repository — it drives canonical URLs, the sitemap, Open Graph tags and all
"edit on GitHub" links.

## Project structure

```
content/docs/            All guidance, as MDX with frontmatter
  foundations/           Principles, plain language, accessibility, inclusion
  mechanics/             Capitalisation, dates, numbers, currency
  patterns/              Buttons, error messages, forms, notifications
  nigeria/               Nigerian English, financial terms, IDs, addresses
  multilingual/          Translation principles
  operations/            Contribution, standards, proposals, governance

src/
  app/
    layout.tsx           Fonts, theme script, skip link, global metadata
    page.tsx             Homepage (hero, why it matters, featured, open source)
    docs/[...slug]/      Catch-all docs route — statically generated
    sitemap.ts robots.ts SEO outputs
  components/
    Header / Footer / Sidebar / MobileNav / Search / TableOfContents / ThemeToggle
    mdx/                 Callout, Do/Don't, CopyExample, Example + component map
  lib/
    docs.ts              Filesystem MDX loader + heading/search-index extraction
    navigation.ts        Curated sidebar tree (single source of nav truth)
    slugify.ts           Shared anchor-id generator
    site.ts              Site name, URL, GitHub links
```

## Adding a page

1. Create `content/docs/<section>/<slug>.mdx` with frontmatter:

   ```mdx
   ---
   title: Page title
   description: One sentence shown under the title and in search.
   keywords: [terms, users, might, search]
   ---
   ```

2. Add the page to `src/lib/navigation.ts` in the right section. That single
   entry drives the sidebar, the mobile drawer, prev/next pagination and
   search ordering.

3. Use the documentation components anywhere in the MDX:

   ```mdx
   <DoDont>
   <Do>Send ₦5,000</Do>
   <Dont>Submit</Dont>
   </DoDont>

   <Note>Supporting detail readers can skip.</Note>
   <Warning>Something that prevents harm if read.</Warning>
   <CopyExample label="Button label">Confirm transfer of ₦12,525</CopyExample>
   <Example title="Full screen state">Longer illustrative content.</Example>
   ```

## Implementation decisions

- **`next-mdx-remote/rsc` over `@next/mdx`** — content lives in `/content`
  outside the app directory, so editors touch only MDX, and the loader can
  build the search index and tables of contents from the same source.
- **No rehype/remark plugins for anchors** — custom `h2`/`h3` MDX components
  generate ids with the same `slugify()` used by the TOC extractor, keeping
  anchors and the "On this page" list in lockstep with two fewer dependencies.
- **Search is a build-time index shipped to the client** — right-sized for a
  documentation site of this scale: instant results, zero requests per
  keystroke, works offline. Swap in Pagefind behind the same dialog if the
  guide grows past a few hundred pages.
- **Curated navigation data, not filesystem-generated** — editors control
  grouping and order deliberately, as GOV.UK does.
- **Theme without a library** — an inline pre-paint script plus a class
  toggle; no flash of the wrong theme, no dependency.

## Accessibility

Built to WCAG 2.2 AA:

- Skip-to-content link as the first focusable element on every page
- Semantic landmarks, one `h1` per page, no skipped heading levels
- 2px visible focus rings on every interactive element
- Mobile drawer and search dialog: `role="dialog"`, `aria-modal`, Escape to
  close, focus moved in and trapped, body scroll locked
- Search follows the combobox pattern (`aria-activedescendant`) with a live
  region announcing result counts
- Do/Don't cards pair colour with text labels — meaning never colour-alone
- `prefers-reduced-motion` disables all animation globally
- Text contrast ≥ 4.5:1 in both themes; tap targets ≥ 40px on mobile

## Future enhancements

- Pagefind search once content volume justifies it
- Yoruba, Hausa, Igbo and Pidgin translations of the guide itself (i18n routing)
- A linter package (`ncsg-lint`) checking copy against the vocabulary tables
- Figma plugin surfacing guidance beside designs
- Versioned releases with a generated changelog page
- Community showcase of products applying the guide

## Licence

MIT. Guidance content may alternatively be used under CC BY 4.0 — see LICENSE.
