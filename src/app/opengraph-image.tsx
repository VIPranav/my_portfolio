import { ImageResponse } from "next/og";
export const alt = "Pranav VP — Design that ships.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 90,
        background: "#080c15",
        color: "#f5f5f7",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: "#99abc9",
          marginBottom: 40,
        }}
      >
        DESIGN · DEVELOPMENT · CURIOSITY
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 86,
          fontWeight: 600,
          letterSpacing: -4,
        }}
      >
        Pranav VP.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 86,
          fontWeight: 600,
          letterSpacing: -4,
        }}
      >
        Design that ships.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: "#99abc9",
          marginTop: 35,
        }}
      >
        Thoughtfully designed. Built to work.
      </div>
    </div>,
    size,
  );
}
