/**
 * Sidebar navigation tree.
 *
 * Kept as explicit data (rather than generated from the file system) so
 * editors control ordering and grouping — the same reason GOV.UK curates
 * its A–Z manually. Each href must match an MDX file under /content/docs.
 */
export interface NavItem {
  title: string;
  href: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: "Foundations",
    items: [
      { title: "Principles", href: "/docs/foundations/principles" },
      { title: "Plain language", href: "/docs/foundations/plain-language" },
      { title: "Accessibility", href: "/docs/foundations/accessibility" },
      { title: "Inclusive writing", href: "/docs/foundations/inclusive-writing" },
    ],
  },
  {
    title: "Writing mechanics",
    items: [
      { title: "Capitalisation", href: "/docs/mechanics/capitalisation" },
      { title: "Dates and time", href: "/docs/mechanics/dates-and-time" },
      { title: "Numbers", href: "/docs/mechanics/numbers" },
      { title: "Currency", href: "/docs/mechanics/currency" },
    ],
  },
  {
    title: "UI patterns",
    items: [
      { title: "Buttons", href: "/docs/patterns/buttons" },
      { title: "Error messages", href: "/docs/patterns/error-messages" },
      { title: "Forms", href: "/docs/patterns/forms" },
      { title: "Notifications", href: "/docs/patterns/notifications" },
    ],
  },
  {
    title: "Nigerian conventions",
    items: [
      { title: "Nigerian English", href: "/docs/nigeria/nigerian-english" },
      { title: "Financial terminology", href: "/docs/nigeria/financial-terminology" },
      { title: "Government IDs", href: "/docs/nigeria/government-ids" },
      { title: "Address formats", href: "/docs/nigeria/address-formats" },
    ],
  },
  {
    title: "Multilingual guidance",
    items: [
      { title: "Translation principles", href: "/docs/multilingual/translation-principles" },
    ],
  },
  {
    title: "Content operations",
    items: [
      { title: "How to contribute", href: "/docs/operations/how-to-contribute" },
      { title: "Editorial standards", href: "/docs/operations/editorial-standards" },
      { title: "Proposal process", href: "/docs/operations/proposal-process" },
      { title: "Governance", href: "/docs/operations/governance" },
      { title: "Code of conduct", href: "/docs/operations/code-of-conduct" },
    ],
  },
];

/** Flattened list used by search and prev/next pagination. */
export const allNavItems: (NavItem & { section: string })[] = navigation.flatMap(
  (section) => section.items.map((item) => ({ ...item, section: section.title }))
);
