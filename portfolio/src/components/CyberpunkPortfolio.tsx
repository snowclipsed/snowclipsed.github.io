'use client';

// src/components/CyberpunkPortfolio.tsx
import React, { useState } from 'react';
import { Terminal, Book, Network, Target, Brain } from 'lucide-react';
import CyberpunkBlog from './CyberpunkBlog';
import CyberpunkContact from './CyberpunkContact';
import CyberpunkLorenz from './CyberpunkLorenz';
import ThemeToggle from './ThemeToggle';
import type { BlogPost } from '../lib/markdown';

interface CyberpunkPortfolioProps {
  posts?: BlogPost[];
}
const CyberpunkPortfolio: React.FC<CyberpunkPortfolioProps> = ({ posts = [] }) => {
  const [activeSection, setActiveSection] = useState('main');
  const [glitchText, setGlitchText] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const navItems = [
    { id: 'main', icon: <Terminal className="w-5 h-5" />, label: 'メイン' },
    { id: 'blog', icon: <Book className="w-5 h-5" />, label: 'ブログ' },
    { id: 'contact', icon: <Network className="w-5 h-5" />, label: 'コンタクト' }
  ];

  const triggerGlitch = () => {
    setGlitchText(true);
    setTimeout(() => setGlitchText(false), 100);
  };

  const handleNavigation = (sectionId: string) => {
    if (sectionId === 'blog' && activeSection === 'blog') {
      // Reset to blog listing when clicking blog button while in blog section
      setSelectedPost(null);
    }
    setActiveSection(sectionId);
    triggerGlitch();
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
            onClick={() => handleNavigation(id)}
            className={`border transition-all duration-100
              dark:border-white border-black p-4 
              flex items-center justify-center gap-2 relative group
              ${activeSection === id 
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
      <div className="border transition-colors duration-100 dark:border-white border-black">
        <div className="p-6">
        {activeSection === 'main' && (
          <div className="space-y-8">
            {/* Dynamic System - Updated container */}
            <div className="mb-12">
              <h2 className="text-2xl mb-4 font-bold">私について / CHAOS ENGINE</h2>
              <div className="w-full" onWheel={e => e.stopPropagation()}>
                <CyberpunkLorenz />
              </div>
            </div>

            <div className="mt-8 border-t border-dotted transition-colors duration-100 
              dark:border-white/20 border-black/20 pt-8 w-full" />

              {/* Introduction */}
              <div className="mb-12 mt-8">
              <h2 className="text-2xl mb-6 font-bold">研究分野 / ABOUT ME</h2>
                <div className="space-y-4 opacity-90">
                  <p>Hi, I am snow/snowclipsed.</p>
                  <p>Welcome to my digital realm. I am a machine learning engineer specializing in 
                  deep learning architecture research and inference optimization.</p>
                </div>
                <div className="mt-8 border-t border-dotted transition-colors duration-100 
                  dark:border-white/20 border-black/20 pt-8 w-full" />
              </div>

              {/* Research Domains */}
              <div className="mb-12">
                <h2 className="text-2xl mb-6 font-bold">研究分野 / RESEARCH DOMAINS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Core Research */}
                  <div>
                    <h3 className="text-xl mb-4 flex items-center gap-2">
                      <Brain className='w-5 h-5'/> コア・リサーチ / CORE RESEARCH
                    </h3>
                    <div className="space-y-2">
                      <div className="border transition-colors duration-100 
                        dark:border-white/20 border-black/20 p-2 
                        dark:hover:border-white/40 hover:border-black/40">
                        <span className="text-blue-400 mr-2">◇</span>
                        Deep Learning Architecture Research
                      </div>
                      <div className="border transition-colors duration-100 
                        dark:border-white/20 border-black/20 p-2 
                        dark:hover:border-white/40 hover:border-black/40">
                        <span className="text-blue-400 mr-2">◇</span>
                        Inference Optimization
                      </div>
                      <div className="border transition-colors duration-100 
                        dark:border-white/20 border-black/20 p-2 
                        dark:hover:border-white/40 hover:border-black/40">
                        <span className="text-blue-400 mr-2">◇</span>
                        Low Level Programming
                      </div>
                    </div>
                  </div>

                  {/* Current Goals */}
                  <div>
                    <h3 className="text-xl mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" /> 現在の目標 / CURRENT GOALS
                    </h3>
                    <div className="space-y-2">
                      <div className="border transition-colors duration-100 
                        dark:border-white/20 border-black/20 p-2 
                        dark:hover:border-white/40 hover:border-black/40">
                        <span className="text-green-400 mr-2">⊕</span>
                        Scaling ML Models
                      </div>
                      <div className="border transition-colors duration-100 
                        dark:border-white/20 border-black/20 p-2 
                        dark:hover:border-white/40 hover:border-black/40">
                        <span className="text-green-400 mr-2">⊕</span>
                        Low-End Device Optimization
                      </div>
                      <div className="border transition-colors duration-100 
                        dark:border-white/20 border-black/20 p-2 
                        dark:hover:border-white/40 hover:border-black/40">
                        <span className="text-green-400 mr-2">⊕</span>
                        CPU/GPU Architecture Research
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-dotted transition-colors duration-100 
                dark:border-white/20 border-black/20 pt-8 w-full" />

              {/* Offline Mode */}
              <div className="mb-8">
                <h2 className="text-2xl mb-4 font-bold">オフライン・モード / OFFLINE MODE</h2>
                <p className="opacity-90 font-mono">
                  Beyond the terminal, I create games, write blog posts, make digital art, 
                  and explore virtual worlds. You can find my thoughts on my blog or follow 
                  my journey on social media.
                </p>
              </div>
            </div>
          )}

        {activeSection === 'blog' && (
                    <CyberpunkBlog 
                      posts={posts} 
                      selectedPost={selectedPost}
                      setSelectedPost={setSelectedPost}
                    />
                  )}
          {activeSection === 'contact' && <CyberpunkContact />}
        </div>
      </div>

      <footer className="p-4 mt-8 opacity-70 hover:opacity-100 transition-opacity duration-100">
        <p className="text-center">© 2024 スノーエクリプス</p>
      </footer>
    </div>
  );
};

export default CyberpunkPortfolio;