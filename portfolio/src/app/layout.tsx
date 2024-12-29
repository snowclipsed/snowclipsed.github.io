import type { Metadata } from 'next';
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
    <html lang="en" className="bg-black">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}