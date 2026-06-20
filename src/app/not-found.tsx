import Link from "next/link";

/*
  The 404 page practises what the guide preaches: say what happened,
  don't blame the user, offer a clear way forward.
*/
export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto max-w-content px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-green-600">404</p>
      <h1 className="mt-3 font-display text-4xl">We can't find that page</h1>
      <p className="mx-auto mt-4 max-w-md text-ink-soft dark:text-[#A8B3AC]">
        The page may have moved, or the link may be out of date. Try the search,
        or start from the guide's home page.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-sm bg-green-900 px-5 py-3 font-semibold text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
      >
        Go to the home page
      </Link>
    </main>
  );
}
