/** @type {import('next').NextConfig} */
const nextConfig = {
  // All documentation pages are statically generated at build time
  // (generateStaticParams in src/app/docs/[...slug]/page.tsx), so the
  // site can be served from Vercel's edge/CDN with no server cost.
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ncsg.guide" }],
        destination: "https://ncsg.guide/:path*",
        permanent: true,
      },
      {
        source: "/docs",
        destination: "/docs/foundations/principles",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
