import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "पावटा नगर पालिका चुनाव 2026 | पत्रिका जयपुर न्यूज़",
  description:
    "पावटा नगर पालिका चुनाव 2026 का अनौपचारिक जनमत सर्वेक्षण।",
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <header className="site-header">
          <div className="container-page header-inner">
            <Link href="/" className="brand">
              <div className="brand-name">पत्रिका जयपुर न्यूज़</div>
              <div className="brand-title">
                पावटा नगर पालिका चुनाव 2026
              </div>
            </Link>

            <Link href="/admin" className="admin-link">
              Admin
            </Link>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="container-page footer-inner">
            <div className="footer-brand">पत्रिका जयपुर न्यूज़</div>

            <p>
              यह एक अनौपचारिक जनमत सर्वेक्षण है। यह किसी आधिकारिक चुनावी
              परिणाम का प्रतिनिधित्व नहीं करता।
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
