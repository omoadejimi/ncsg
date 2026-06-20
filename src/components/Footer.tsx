import Link from "next/link";
import { site } from "@/lib/site";

const footerLinks = [
  { title: "About", href: "/docs/foundations/principles" },
  { title: "Contribution guidelines", href: "/docs/operations/how-to-contribute" },
  { title: "Governance", href: "/docs/operations/governance" },
  { title: "Code of conduct", href: "/docs/operations/code-of-conduct" },
  { title: "GitHub", href: site.github, external: true },
  { title: "Changelog", href: `${site.github}/releases`, external: true },
  { title: "Contact", href: `${site.github}/discussions`, external: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-line dark:border-line-dark">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="h-1 w-16 triband" aria-hidden="true" />
        <nav aria-label="Footer" className="mt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {footerLinks.map((link) =>
              link.external ? (
                <li key={link.title}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-soft underline-offset-4 hover:text-ink hover:underline dark:text-[#A8B3AC] dark:hover:text-white"
                  >
                    {link.title}
                  </a>
                </li>
              ) : (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-ink-soft underline-offset-4 hover:text-ink hover:underline dark:text-[#A8B3AC] dark:hover:text-white"
                  >
                    {link.title}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
        <p className="mt-6 text-sm text-ink-mute dark:text-[#8FA097]">
          The Nigerian Content Style Guide is open source under the{" "}
          <a
            href={`${site.github}/blob/main/LICENSE`}
            className="underline underline-offset-4 hover:text-ink dark:hover:text-white"
          >
            MIT licence
          </a>
          . Built by the community, for the community.
        </p>
      </div>
    </footer>
  );
}
