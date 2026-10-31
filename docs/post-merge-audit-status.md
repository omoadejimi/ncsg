# Post merge audit follow up

This records the implementation scope for the audit dated 31 October 2026. Proposed changes are subject to maintainer review. A passed browser check is not full WCAG conformance or user-research evidence.

| Record | Change or remaining requirement |
| --- | --- |
| R01 to R03 | Mobile navigation uses a native modal in the top layer, fills the viewport, isolates background focus and restores focus on dismissal or navigation. Regression checks cover small screens, tablet width and resize to desktop. |
| R04 | Page-specific Open Graph and Twitter metadata, a 1200 by 630 sharing image and image alternative text. Real social-platform card rendering needs a check after deployment. |
| R05 | Offline and related connection terms are indexed for Accessibility. Save and resume remains a content-research gap; no unrelated page is labelled as that guidance. |
| R06 | Removed the nonexistent README contact reference and state that private reporting is not configured. A monitored address or form, a backup and a tested reporting process must still be supplied by the maintainer. Do not mark this record complete until the route works. |
| R07 | A populated on-site changelog links the actual merged source commits and dates. It does not invent a reviewed release or user validation. |
| R08 and R09 | Descriptive search titles, homepage WebSite structured data and a stable icon. No indexing or ranking guarantee is implied. |
| R10 | Public responsible-role and edit-date information, explicit specialist-review status and review triggers. Governance shows the responsible role by content area. Named backups and specialist reviews remain to be arranged; none are fabricated. Governance additions need review under the existing proposal policy. |
| R11 | Application configuration returns a permanent HTTP redirect for /docs, with a readable fallback page. Test with JavaScript disabled. |
| R12 | An application-level permanent www redirect preserves paths and queries. Vercel domain redirects may run before application rules. After deployment, check the raw www response and update the Vercel domain redirect if it still returns 307. |
| R13 | One Escape dismisses search from a filled input as well as the close button. |
| V01 | Overflowing tables get an explicit named, keyboard-focusable region; fitting tables do not add a tab stop. Firefox, Safari, NVDA and TalkBack still need manual coverage. |
| V02 | Browser checks support manual accessibility review. The seven default-state symbol contrast warnings were separately checked as described below. Complete real screen-reader, device, forced-colour, browser zoom and target-spacing checks before making a conformance claim. |
| V03 | Owner-only Search Console, Bing and field-performance evidence is still required. Existing analytics and Speed Insights pull requests are separate work; this branch does not merge or duplicate them. |

## Before merging

- Review the sharing image and editorial metadata.
- Supply and test the private conduct-reporting route, or keep R06 explicitly open.
- Confirm responsible people and backups for priority pages. An edit date is not an approval date.
- Review the governance additions under the current proposal process.
- Run the production build and browser regression tests described in the README.

## Local validation on 31 October 2026

- The production build passes; content pages, the icon and the social image are statically generated.
- All 30 Playwright checks pass across desktop and mobile Chromium projects, including navigation at widths 320, 375 and 768, pointer and keyboard dismissal, destination focus, redirects without JavaScript and social metadata across 24 content URLs.
- Twenty-eight axe scans found no violations under the configured WCAG A and AA tags through 2.2 and best practices: 24 desktop pages, the open mobile menu, two narrow guidance pages and a dark-theme page.
- Axe left seven symbol contrast nodes for review: six decorative, aria-hidden arrows on the homepage and the naira symbol in Currency. Computed foreground/background pairs gave 16.48:1 in the tested default light state and 15.61:1 in the default dark state. This does not cover every interaction state or replace a complete visual review.
- Visually checked the repaired mobile drawer, the sharing image and the dark-theme changelog. No assistive-technology session or physical-device test was conducted.

Browser checks used Chromium 153 through the documented Playwright executable override. They do not establish full WCAG conformance, search-engine indexing or field performance.

## After deployment

- Fetch /docs and a www documentation URL without following redirects. Confirm status, Location and query preservation. A hosting-level rule may need changing separately.
- Check the shared image and sample cards for the homepage, Nigerian English and Error messages.
- Confirm the sitemap contains 24 canonical content URLs, including the changelog.
- In Search Console, inspect the homepage and representative guidance URLs; record declared and selected canonicals, processing dates and indexing outcomes. Submit the sitemap through the owner's account.
- Record the Core Web Vitals baseline if field data is available. Otherwise record repeatable lab-test conditions rather than treating proxy timings as user performance.
- Complete the accessibility matrix with disabled participants and the relevant assistive technologies. Keep missing evidence visible.
