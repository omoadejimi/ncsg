/** @type {import('next').NextConfig} */
const nextConfig = {
  // All documentation pages are statically generated at build time
  // (generateStaticParams in src/app/docs/[...slug]/page.tsx), so the
  // site can be served from Vercel's edge/CDN with no server cost.
  reactStrictMode: true,
};

export default nextConfig;
