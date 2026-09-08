import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "पावटा नगर पालिका चुनाव 2026 | पत्रिका जयपुर न्यूज़",
  description: "जनमत सर्वेक्षण - वार्ड नं. 25",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  );
}
