import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "पावटा नगर पालिका चुनाव 2026 | पत्रिका जयपुर न्यूज़",
  description: "जनमत सर्वेक्षण - आपके क्षेत्र की जनता की पसंद कौन?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
