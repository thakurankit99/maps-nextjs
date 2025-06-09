import type { Metadata, Viewport } from "next";
import Script from 'next/script';
import "./globals.css";

export const metadata: Metadata = {
  title: "O-Maps - Project by Team Vayu Sena",
  description: "The indoor map of Health Center North Campus IIT Mandi. designed by Sahil , Ankit. facilitates easy navigation for new visitors.",
  keywords: "The indoor map of Health Center North Campus IIT Mandi. designed by Sahil , Ankit. facilitates easy navigation for new visitors.",
  icons: {
    icon: [
      { url: "/images/favicon/favicon.ico", type: "image/x-icon" },
      { url: "/images/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Google Web Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Ubuntu:wght@500;700&display=swap" rel="stylesheet" />

        {/* Icon Font Stylesheet */}
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet" />

        {/* Libraries Stylesheet */}
        <link href="/lib/animate/animate.min.css" rel="stylesheet" />
        <link href="/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet" />

        {/* Customized Bootstrap Stylesheet */}
        <link href="/css/bootstrap.min.css" rel="stylesheet" />

        {/* OMAPS Stylesheet */}
        <link href="/css/style.css" rel="stylesheet" />
        <link href="/css/style1.css" rel="stylesheet" />

        {/* FontAwesome Kit */}
        <script src="https://kit.fontawesome.com/224fddad20.js" crossOrigin="anonymous" async></script>
      </head>
      <body>
        {/* Disable DevTools - Only in Production */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src="https://cdn.jsdelivr.net/npm/disable-devtool"
              strategy="beforeInteractive"
            />
            <Script id="disable-devtool-init" strategy="afterInteractive">
              {`
                if (typeof DisableDevtool !== 'undefined') {
                  DisableDevtool({
                    url: window.location.origin,
                    disableMenu: true,
                    disableSelect: false,
                    disableCopy: false,
                    disableCut: false,
                    disablePaste: false,
                    clearLog: true,
                    interval: 200
                  });
                  console.log('🔒 DevTools protection enabled in production');
                }
              `}
            </Script>
          </>
        )}

        {/* Development Mode Indicator */}
        {process.env.NODE_ENV === 'development' && (
          <Script id="dev-mode-indicator" strategy="afterInteractive">
            {`
              console.log('🛠️ Development mode: DevTools protection disabled');
              console.log('🚀 DevTools protection will be enabled in production deployment');
            `}
          </Script>
        )}

        {children}
      </body>
    </html>
  );
}
