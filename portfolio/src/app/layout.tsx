// src/app/layout.tsx
import type { Metadata } from 'next';
import { ThemeProvider } from '../context/ThemeContext';
import './globals.css';
import './prism-cyberpunk.css';

export const metadata: Metadata = {
  title: 'Snowclipsed // AI Research',
  description: 'Deep Learning Architecture Research, Inference Optimization, and Low Level Programming',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000'
      }
    ]
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const savedTheme = localStorage.getItem('theme') || 'dark';
              document.documentElement.classList.add(savedTheme);

              window.MathJax = {
                tex: {
                  inlineMath: [['\\\\(', '\\\\)']],
                  displayMath: [['$$', '$$']],
                  processEscapes: true,
                },
                options: {
                  skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
                }
              };
            `,
          }}
        />
        <style>{`
          /* Mobile: Smaller base font size to counteract no scaling */
          @media (max-width: 767px) {
            html { font-size: 12px; }
          }
          /* Desktop: Normal font size with scaling */
          @media (min-width: 768px) {
            html { font-size: 16px; }
          }
        `}</style>
      </head>
      <body className="antialiased transition-colors duration-100
        dark:bg-black dark:text-white
        bg-white text-black">
        <ThemeProvider>
          <div className="min-h-screen flex justify-center items-center">
            {/* Mobile: No scale (100%), Desktop: 60% scale */}
            <div className="scale-100 md:scale-[1.0] origin-top w-full">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}