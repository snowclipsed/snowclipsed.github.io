'use client';

import React, { useState } from 'react';
import { Terminal, Book, Network, Mail, Globe, Twitter } from 'lucide-react';
import CyberpunkLorenz from './CyberpunkLorenz';

type Section = 'main' | 'blog' | 'contact';

interface NavItem {
  id: Section;
  icon: React.ReactNode;
  label: string;
}

const CyberpunkPortfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('main');

  const navItems: NavItem[] = [
    { id: 'main', icon: <Terminal className="w-5 h-5" />, label: 'メイン' },
    { id: 'blog', icon: <Book className="w-5 h-5" />, label: 'ブログ' },
    { id: 'contact', icon: <Network className="w-5 h-5" />, label: 'コンタクト' }
  ];

  const asciiArt = {
    main: `
    スノーエクリプス / SNOW ECLIPSE`,
    blog: `
    ╔═══════════════════════════════════╗
    ║  BLOG SYSTEM v2.0                 ║
    ║  STATUS: INITIALIZED              ║
    ║  ENTRIES: LOADING...             ║
    ╚═══════════════════════════════════╝`,
    contact: `
    ╔═══════════════════════════════════╗
    ║  NETWORK STATUS: ACTIVE           ║
    ║  ENCRYPTION: ENABLED              ║
    ║  FIREWALL: ACTIVE                ║
    ║  CONNECTION: SECURE               ║
    ╚═══════════════════════════════════╝`
  };

  const blogPosts = [
    {
      date: '2024.12.28',
      title: 'Optimizing Neural Network Inference',
      preview: 'Exploring cutting-edge techniques in model optimization and deployment...'
    },
    {
      date: '2024.12.25',
      title: 'Low-Level Architecture Deep Dive',
      preview: 'Understanding the intersection of hardware and ML acceleration...'
    },
    {
      date: '2024.12.20',
      title: 'Research Notes: Architecture Innovation',
      preview: 'New approaches to neural network architecture design...'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4 transition-all duration-300">
      {/* Header with hover effect */}
      <header className="border border-white p-4 mb-8 hover:bg-white hover:text-black transition-colors duration-300">
        <h1 className="text-3xl md:text-4xl mb-2 font-bold">スノーエクリプス / SNOWCLIPSED</h1>
        <p className="text-lg md:text-xl opacity-80">デジタル・リサーチャー / DIGITAL RESEARCHER</p>
      </header>

      {/* Navigation with improved hover effects */}
      <nav className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
        {navItems.map(({id, icon, label}) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`border border-white p-3 md:p-4 flex items-center justify-center gap-2 
              hover:bg-white hover:text-black transition-all duration-300 
              ${activeSection === id ? 'bg-white text-black scale-105' : 'hover:scale-105'}`}
          >
            {icon} <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content with smooth transitions */}
      <div className="border border-white p-4 transition-all duration-500 ease-in-out">
        {/* ASCII Art Section with hover effect */}
        <pre className="text-xs md:text-sm lg:text-base overflow-x-auto mb-8 p-4 hover:bg-white hover:text-black transition-colors duration-300 cursor-crosshair font-mono">
          {asciiArt[activeSection]}
        </pre>

        {/* Content Sections with transitions */}
        <div className="transition-all duration-500 ease-in-out">
          {activeSection === 'main' && (
            
            <div className="space-y-6 animate-fade-in">
              <CyberpunkLorenz />
              <div className="border border-white p-4">
              
                <h2 className="text-2xl mb-4 font-bold">研究分野 / RESEARCH INTERESTS</h2>
                <div className="space-y-4">
                  {[
                    'Deep Learning Architecture Research',
                    'Inference Optimization',
                    'Low Level Programming'
                  ].map((interest, index) => (
                    <div key={index} 
                      className="flex items-center gap-2 p-2 hover:bg-white hover:text-black transition-colors duration-300 ">
                      <Terminal className="w-5 h-5 min-w-[1.25rem]" />
                      <span>{interest}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'blog' && (
            <div className="space-y-4">
              {blogPosts.map((post, index) => (
                <div 
                  key={post.title}
                  className="border border-white p-4 hover:bg-white hover:text-black transition-all duration-300 
                    cursor-pointer transform hover:scale-[1.02]"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <h3 className="text-xl font-bold">{post.title}</h3>
                    <span className="opacity-70 text-sm md:text-base">{post.date}</span>
                  </div>
                  <p className="opacity-80">{post.preview}</p>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-4">
              {[
                { icon: <Mail className="w-5 h-5" />, label: 'メール', value: 'snowclipsed@gmail.com' },
                { icon: <Twitter className="w-5 h-5" />, label: 'Twitter', value: '@snowclipsed', link: 'https://x.com/snowclipsed' }
              ].map(({icon, label, value, link}, index) => (
                <div 
                  key={label}
                  className="border border-white p-4 flex items-center gap-4 hover:bg-white hover:text-black 
                    transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {icon}
                  <div>
                    <p className="text-sm opacity-70">{label}</p>
                    {link ? (
                      <a href={link} target="_blank" rel="noopener noreferrer" 
                        className="hover:underline hover:opacity-80 transition-opacity duration-300">
                        {value}
                      </a>
                    ) : (
                      <p>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer with hover effect */}
      <footer className="border border-white border-t-0 p-4 mt-8 hover:bg-white hover:text-black transition-colors duration-300">
        <p className="text-center">© 2024 スノーエクリプス</p>
      </footer>
    </div>
  );
};

export default CyberpunkPortfolio;