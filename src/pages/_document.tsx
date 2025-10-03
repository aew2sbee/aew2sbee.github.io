import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-V41BQHBSBJ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-V41BQHBSBJ');
            `,
          }}
        />
        <link rel="icon" href="/favicon.png" />

        {/* デフォルトメタデータ */}
        <meta name="description" content="YouTubeチャンネルの記録を可視化するアナリティクスアプリ" />

        {/* デフォルトOGP設定 */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="アナリティクスアプリ" />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:description" content="YouTubeチャンネルの記録を可視化するアナリティクスアプリ" />
        <meta property="og:image" content="https://aew2sbee.github.io/favicon.png" />

        {/* デフォルトTwitter Card設定 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://aew2sbee.github.io/favicon.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
