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
          background: "linear-gradient(135deg, #5c4a3a 0%, #6b5344 100%)",
          borderRadius: "32px",
        }}
      >
        <svg
          viewBox="0 0 512 512"
          width="140"
          height="140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(256,260)">
            <rect x="-80" y="120" width="160" height="14" rx="7" fill="#c0764a"/>
            <rect x="-16" y="108" width="32" height="20" rx="4" fill="#c0764a"/>
            <rect x="-7" y="-100" width="14" height="210" rx="7" fill="#c0764a"/>
            <circle cx="0" cy="-110" r="22" fill="#c0764a"/>
            <circle cx="0" cy="-110" r="12" fill="#5c4a3a"/>
            <rect x="-148" y="-96" width="296" height="10" rx="5" fill="#c0764a"/>
            <line x1="-140" y1="-86" x2="-140" y2="10" stroke="#c0764a" stroke-width="6"/>
            <line x1="-105" y1="-86" x2="-105" y2="10" stroke="#c0764a" stroke-width="6"/>
            <line x1="105" y1="-86" x2="105" y2="10" stroke="#c0764a" stroke-width="6"/>
            <line x1="140" y1="-86" x2="140" y2="10" stroke="#c0764a" stroke-width="6"/>
            <path d="M-178,10 C-178,38 -166,56 -122,56 C-78,56 -66,38 -66,10" stroke="#c0764a" stroke-width="7" fill="none"/>
            <ellipse cx="-122" cy="10" rx="56" ry="6" stroke="#c0764a" stroke-width="7" fill="none"/>
            <path d="M66,10 C66,38 78,56 122,56 C166,56 178,38 178,10" stroke="#c0764a" stroke-width="7" fill="none"/>
            <ellipse cx="122" cy="10" rx="56" ry="6" stroke="#c0764a" stroke-width="7" fill="none"/>
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
