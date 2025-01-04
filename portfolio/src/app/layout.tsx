// src/app/layout.tsx
import type { Metadata } from 'next';
import { ThemeProvider } from '../context/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Snowclipsed - Digital Research',
  description: 'Deep Learning Architecture Research, Inference Optimization, and Low Level Programming',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent flash of wrong theme
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
      </head>
      <body className="antialiased transition-colors duration-100
        dark:bg-black dark:text-white
        bg-white text-black">
        <ThemeProvider>
          <div className="min-h-screen flex justify-center items-center">
            <div style={{
              transform: 'scale(0.60)',
              transformOrigin: 'center top',
              width: '100%'
            }}>
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}