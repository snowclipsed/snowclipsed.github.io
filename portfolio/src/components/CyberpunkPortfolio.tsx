'use client';

// src/components/CyberpunkPortfolio.tsx
import React, { useState } from 'react';
import { Terminal, Book, Network } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface CyberpunkPortfolioProps {
  children: React.ReactNode;
}

const CyberpunkPortfolio: React.FC<CyberpunkPortfolioProps> = ({ children }) => {
  const [glitchText, setGlitchText] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { id: '/', icon: <Terminal className="w-5 h-5" />, label: 'メイン' },
    { id: '/blog', icon: <Book className="w-5 h-5" />, label: 'ブログ' },
    { id: '/contact', icon: <Network className="w-5 h-5" />, label: 'コンタクト' }
  ];

  const triggerGlitch = () => {
    setGlitchText(true);
    setTimeout(() => setGlitchText(false), 100);
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
          <Link
            key={id}
            href={id}
            onClick={triggerGlitch}
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
          </Link>
        ))}
      </nav>

      {/* Main Content Container */}
      <div className="border transition-colors duration-100 dark:border-white border-black">
        <div className="p-6">
          {children}
        </div>
      </div>

      <footer className="p-4 mt-8 opacity-70 hover:opacity-100 transition-opacity duration-100">
        <p className="text-center">© 2024 スノーエクリプス</p>
      </footer>
    </div>
  );
};

export default CyberpunkPortfolio;