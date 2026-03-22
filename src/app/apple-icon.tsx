import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a5f 0%, #2a5a8f 100%)",
          borderRadius: "32px",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: "110px",
            fontWeight: 700,
            color: "white",
            fontFamily: "serif",
            marginTop: "-8px",
          }}
        >
          法
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "36px",
            right: "36px",
            height: "4px",
            background: "#c9a84c",
            borderRadius: "2px",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
