import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Про-Латекс — матрасы из 100% натурального латекса";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public", "logo-400.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #F7F2EA 0%, #D8C4A6 100%)",
          padding: "80px",
        }}
      >
        <img src={logoSrc} width={140} height={140} alt="" />
        <div
          style={{
            marginTop: 40,
            fontSize: 56,
            fontWeight: 800,
            color: "#16181D",
            letterSpacing: "-0.02em",
            maxWidth: 900,
          }}
        >
          Матрасы из 100% натурального латекса
        </div>
        <div style={{ marginTop: 24, fontSize: 28, color: "#5B616B" }}>
          Про-Латекс · специалист по натуральному латексу, компания основана в 2009 году
        </div>
      </div>
    ),
    { ...size }
  );
}
