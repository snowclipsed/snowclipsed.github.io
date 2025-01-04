'use client';

// src/components/CyberpunkShell.tsx
import React, { useState } from 'react';
import { Terminal, Book, Network, Brain, Target } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useRouter, usePathname } from 'next/navigation';
import CyberpunkLorenz from './CyberpunkLorenz';
import CyberpunkBlog from './CyberpunkBlog';
import CyberpunkContact from './CyberpunkContact';

interface CyberpunkShellProps {
  posts?: any[];
  initialPost?: any;
}

export default function CyberpunkShell({ posts, initialPost }: CyberpunkShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [glitchText, setGlitchText] = useState(false);

  const navItems = [
    { id: '/', icon: <Terminal className="w-5 h-5" />, label: 'メイン' },
    { id: '/blog', icon: <Book className="w-5 h-5" />, label: 'ブログ' },
    { id: '/contact', icon: <Network className="w-5 h-5" />, label: 'コンタクト' }
  ];

  const triggerGlitch = () => {
    setGlitchText(true);
    setTimeout(() => setGlitchText(false), 100);
  };

  // Render content based on pathname
  const renderContent = () => {
    if (pathname === '/') {
      return (
        <div className="space-y-8">
          {/* Dynamic System */}
          <div className="mb-12">
            <h2 className="text-2xl mb-4 font-bold">私について / CHAOS ENGINE</h2>
            <div className="w-full">
              <CyberpunkLorenz />
            </div>
          </div>

          <div className="mt-8 border-t border-dotted transition-colors duration-100 
            dark:border-white/20 border-black/20 pt-8 w-full" />

          {/* Rest of home page content */}
          {/* ... */}
          
        </div>
      );
    } else if (pathname.startsWith('/blog')) {
      if (initialPost) {
        return <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: initialPost.content }} />;
      }
      return <CyberpunkBlog posts={posts} />;
    } else if (pathname === '/contact') {
      return <CyberpunkContact />;
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-100
      dark:bg-black dark:text-white
      bg-white text-black
      font-mono p-4 max-w-4xl mx-auto">
      
      <ThemeToggle />

      {/* Header */}
      <header className="border transition-colors duration-100 dark:border-white border-black p-6 mb-8 relative group">
        <div className={`transition-all duration-100 ${glitchText ? 'transform translate-x-1' : ''}`}>
          <h1 className="text-3xl md:text-4xl mb-2 font-bold relative">
            <span className="opacity-80 absolute -left-1 -top-1 text-red-500">スノーエクリプス</span>
            <span className="opacity-80 absolute -left-1 top-1 text-blue-500">スノーエクリプス</span>
            スノーエクリプス / SNOWCLIPSED
          </h1>
          <p className="text-lg md:text-xl opacity-80">
            ニューラル・アーキテクト / NEURAL ARCHITECT
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="grid grid-cols-3 gap-4 mb-8">
        {navItems.map(({id, icon, label}) => (
          <button
            key={id}
            onClick={() => {
              triggerGlitch();
              router.push(id);
            }}
            className={`border transition-all duration-100
              dark:border-white border-black p-4 
              flex items-center justify-center gap-2 relative group
              ${pathname === id 
                ? 'dark:bg-white dark:text-black bg-black text-white' 
                : ''}
              dark:hover:bg-white dark:hover:text-black
              hover:bg-black hover:text-white`}
          >
            <div className="relative">
              <div className="opacity-80 absolute -left-0.5 -top-0.5 text-red-500 pointer-events-none 
                group-hover:translate-x-1 transition-transform duration-100">
                {icon}
              </div>
              <div className="opacity-80 absolute -left-0.5 top-0.5 text-blue-500 pointer-events-none 
                group-hover:-translate-x-1 transition-transform duration-100">
                {icon}
              </div>
              {icon}
            </div>
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content Container */}
      <main className="border transition-colors duration-100 dark:border-white border-black">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>

      <footer className="p-4 mt-8 opacity-70 hover:opacity-100 transition-opacity duration-100">
        <p className="text-center">© 2024 スノーエクリプス</p>
      </footer>
    </div>
  );
}