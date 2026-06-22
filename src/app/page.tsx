import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Homepage.
 *
 * Structure follows the brief: hero → why it matters → featured
 * guidance → open source → footer (global). The design spends its one
 * expressive moment on the hero (Newsreader display type over the
 * tri-band rule); everything below stays quiet and scannable.
 */

const featured = [
  {
    title: "Plain language",
    description: "Write so a first-time smartphone user in Kano and a Lagos product manager both understand first time.",
    href: "/docs/foundations/plain-language",
  },
  {
    title: "Error messages",
    description: "Say what happened, reassure people about their money, and show the way forward.",
    href: "/docs/patterns/error-messages",
  },
  {
    title: "Nigerian English",
    description: "Standardise the words Nigerians actually use — airtime, BVN, POS — with confidence.",
    href: "/docs/nigeria/nigerian-english",
  },
  {
    title: "Accessibility",
    description: "Content that works on a ₦30,000 Android phone, over 3G, with a screen reader.",
    href: "/docs/foundations/accessibility",
  },
  {
    title: "Financial terminology",
    description: "Consistent language for transfers, wallets, KYC and charges across fintech products.",
    href: "/docs/nigeria/financial-terminology",
  },
  {
    title: "Translation principles",
    description: "Approach Yoruba, Hausa, Igbo and Nigerian Pidgin as first-class languages, not afterthoughts.",
    href: "/docs/multilingual/translation-principles",
  },
];

const whyItMatters = [
  {
    title: "Over 500 languages, one interface",
    body: "Because English is not the first language of many Nigerians, clear content can help improve user interaction.",
  },
  {
    title: "Mobile-first by necessity",
    body: "The overwhelming majority of Nigerians reach the internet through low-cost Android phones on metered data. Every unnecessary word costs money and patience.",
  },
  {
    title: "Words move money",
    body: "In fintech, a vague error message creates panic about a double debit. Precise, honest copy is a trust and inclusion issue, not a polish issue.",
  },
  {
    title: "Shared standards raise everyone",
    body: "Teams across banks, startups and government keep solving the same writing problems alone. A common, open reference means consistent experiences for users everywhere.",
  },
];

export default function HomePage() {
  return (
    <main id="main-content">
      {/* ---- Hero ---- */}
      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-3xl">
            <div className="h-1.5 w-24 triband" aria-hidden="true" />
            <h1 className="mt-8 font-display text-5xl leading-[1.05] sm:text-7xl">
              Write for Nigeria.
              <br />
              <em className="text-green-700 dark:text-green-500">Design for everyone.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft dark:text-[#A8B3AC]">
              An open-source content style guide helping teams create clear,
              inclusive and accessible digital experiences for Nigerian users.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/docs/foundations/principles"
                className="rounded-sm bg-green-900 px-6 py-3.5 font-semibold text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
              >
                Start reading
              </Link>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border-2 border-green-900 px-6 py-3 font-semibold text-green-900 hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-line-dark"
              >
                Contribute on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Why it matters ---- */}
      <section aria-labelledby="why-heading" className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="why-heading" className="font-display text-3xl sm:text-4xl">
            Why it matters
          </h2>
          <dl className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {whyItMatters.map((item) => (
              <div key={item.title} className="border-l-4 border-green-600 pl-5">
                <dt className="font-semibold">{item.title}</dt>
                <dd className="mt-2 leading-relaxed text-ink-soft dark:text-[#A8B3AC]">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- Featured guidance ---- */}
      <section aria-labelledby="featured-heading" className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="featured-heading" className="font-display text-3xl sm:text-4xl">
            Start with the essentials
          </h2>
          <ul className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 dark:border-line-dark dark:bg-line-dark">
            {featured.map((card) => (
              <li key={card.href} className="bg-paper dark:bg-paper-dark">
                <Link
                  href={card.href}
                  className="group block h-full p-6 hover:bg-green-50 dark:hover:bg-[#101A14]"
                >
                  <h3 className="font-semibold group-hover:text-green-700 dark:group-hover:text-green-500">
                    {card.title}
                    <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-[#A8B3AC]">
                    {card.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Open source ---- */}
      <section aria-labelledby="oss-heading">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <h2 id="oss-heading" className="font-display text-3xl sm:text-4xl">
              Built in the open
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft dark:text-[#A8B3AC]">
              The guide belongs to the community that uses it. Anyone can propose
              changes through pull requests, raise questions in discussions, or
              join the editorial review that keeps the guidance evidence-based.
              Decisions are made transparently under an open governance model.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { title: "Open governance", href: "/docs/operations/governance" },
                { title: "Propose a change", href: "/docs/operations/proposal-process" },
                { title: "Editorial standards", href: "/docs/operations/editorial-standards" },
                { title: "How to contribute", href: "/docs/operations/how-to-contribute" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block border border-line px-4 py-3 font-medium hover:border-green-600 hover:text-green-700 dark:border-line-dark dark:hover:text-green-500"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
