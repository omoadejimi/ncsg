import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/** Reuse the site's tri-band identity without remote image or font requests. */
export function GET() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#FBFBF8", color: "#181D1A", padding: 76, display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ display: "flex", gap: 8, height: 58 }}>
          <div style={{ width: 16, background: "#124D35" }} />
          <div style={{ width: 16, background: "#DCE6DF" }} />
          <div style={{ width: 16, background: "#124D35" }} />
        </div>
        <div style={{ display: "flex", fontSize: 32 }}>NCSG</div>
      </div>
      <div style={{ display: "flex", marginTop: 52, fontSize: 68, lineHeight: 1.1, maxWidth: 1000 }}>Nigerian Content Style Guide</div>
      <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "#124D35" }}>Write for Nigeria. Design for everyone.</div>
      <div style={{ display: "flex", marginTop: "auto", fontSize: 26 }}>ncsg.guide</div>
    </div>,
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } },
  );
}
