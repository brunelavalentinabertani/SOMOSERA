import { ImageResponse } from "next/og";

export const alt = "Somos Era - Tecnología original en Argentina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#0b0f14",
        color: "white",
        padding: "80px 90px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
        <div style={{ fontSize: 92, fontWeight: 900, letterSpacing: -5 }}>SOMOS ERA</div>
        <div style={{ marginTop: 28, fontSize: 43, lineHeight: 1.15 }}>
          Tecnología original, importada y segura.
        </div>
        <div style={{ marginTop: 42, fontSize: 27, color: "#c8cdd3" }}>
          Envíos a todo el país · Retiro en Palermo
        </div>
      </div>
      <div style={{ fontSize: 180, fontWeight: 900, color: "#ff5a1f" }}>*</div>
    </div>,
    size,
  );
}
