import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/data";

export const runtime = "nodejs";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const settings = await getSettings();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#f3efe6",
          color: "#16130f",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#8d3b2e" }}>{settings.descriptor}</div>
        <div style={{ marginTop: 24, fontSize: 92, lineHeight: 0.95, letterSpacing: -2 }}>{settings.authorName}</div>
      </div>
    ),
    size,
  );
}
