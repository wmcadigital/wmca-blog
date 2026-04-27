import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-GB">
        <Head>
          {/* Preconnect and DNS prefetch for external CDNs */}
          <link rel="preconnect" href="https://cloudcdn.wmca.org.uk" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://www.wmca.org.uk" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          
          {/* Favicon */}
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          
          {/* Load custom.js early to ensure window globals are available before components mount */}
          <Script src="/custom.js" strategy="beforeInteractive" />
          
          {/* Load custom.css synchronously (2.9 KiB with critical font-display declarations) */}
          <link rel="stylesheet" href="/custom.css" />
          
          {/* Defer external WMCA stylesheet to avoid render-blocking */}
          <link
            rel="preload"
            as="style"
            href="https://www.wmca.org.uk/css/wmcads.min.css"
          />
          <noscript>
            <link rel="stylesheet" href="https://www.wmca.org.uk/css/wmcads.min.css" />
          </noscript>
          
          {/* Defer Google Fonts to avoid render-blocking */}
          <link
            rel="preload"
            as="style"
            href="https://fonts.googleapis.com/css?family=DM+Sans:700&display=swap"
          />
          <noscript>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=DM+Sans:700&display=swap" />
          </noscript>
          
          {/* Preload critical fonts to reduce FOIT/CLS */}
          <link
            rel="preload"
            href="https://cloudcdn.wmca.org.uk/wmcaassets/ds/assets/fonts/notosansdisplay-regular-webfont.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://cloudcdn.wmca.org.uk/wmcaassets/ds/assets/fonts/notosansdisplay-bold-webfont.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          
          {/* Load external stylesheets asynchronously to unblock render */}
          <Script strategy="afterInteractive" id="load-stylesheets">
            {`
              function loadStylesheet(url) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                document.head.appendChild(link);
              }
              
              // Load external stylesheets after interactive content is loaded
              // (custom.css already loaded synchronously with font-display declarations)
              loadStylesheet('https://www.wmca.org.uk/css/wmcads.min.css');
              loadStylesheet('https://fonts.googleapis.com/css?family=DM+Sans:700&display=swap');
            `}
          </Script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
