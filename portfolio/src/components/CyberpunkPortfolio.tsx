import React, { useState } from 'react';
import { Terminal, Book, Network, Code, Cpu, Brain } from 'lucide-react';
import CyberpunkBlog from './CyberpunkBlog';
import CyberpunkContact from './CyberpunkContact';
import CyberpunkLorenz from './CyberpunkLorenz';

const CyberpunkPortfolio = () => {
  const [activeSection, setActiveSection] = useState('main');
  const [glitchText, setGlitchText] = useState(false);

  const navItems = [
    { id: 'main', icon: <Terminal className="w-5 h-5" />, label: 'メイン' },
    { id: 'blog', icon: <Book className="w-5 h-5" />, label: 'ブログ' },
    { id: 'contact', icon: <Network className="w-5 h-5" />, label: 'コンタクト' }
  ];

  const triggerGlitch = () => {
    setGlitchText(true);
    setTimeout(() => setGlitchText(false), 100);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4 max-w-4xl mx-auto">
      {/* Enhanced Header */}
      <header className="border border-white p-6 mb-8 relative group">
        <div className={`transition-all duration-300 ${glitchText ? 'transform translate-x-1' : ''}`}>
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
              setActiveSection(id);
              triggerGlitch();
            }}
            className={`border border-white p-4 flex items-center justify-center gap-2 relative group
              ${activeSection === id ? 'bg-white text-black' : ''}
              hover:bg-white hover:text-black transition-all duration-300`}
          >
            <div className="relative">
              <div className="opacity-80 absolute -left-0.5 -top-0.5 text-red-500 pointer-events-none 
                group-hover:translate-x-1 transition-transform duration-300">
                {icon}
              </div>
              <div className="opacity-80 absolute -left-0.5 top-0.5 text-blue-500 pointer-events-none 
                group-hover:-translate-x-1 transition-transform duration-300">
                {icon}
              </div>
              {icon}
            </div>
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content Container */}
      <div className="border border-white">
        <div className="p-6">
        {activeSection === 'main' && (
          <div className="space-y-8">
            {/* Dynamic System - Updated container */}
            <div className="mb-12">
              <h2 className="text-2xl mb-4 font-bold">私について / CHAOS ENGINE</h2>
              {/* Removed fixed height constraint and border that was causing issues */}
              <div className="w-full">
                <CyberpunkLorenz />
              </div>
            </div>

            <div className="mt-8 border-t border-dotted border-white/20 pt-8 w-full" />

              {/* Introduction */}
              <div className="mb-12 mt-8">
              <h2 className="text-2xl mb-6 font-bold">研究分野 / ABOUT ME</h2>
                <div className="space-y-4 opacity-90">
                  <p>Hi, I am snow/snowclipsed.</p>
                  <p>Welcome to my digital realm. I am a machine learning engineer specializing in 
                  deep learning architecture research and inference optimization.</p>
                </div>
                <div className="mt-8 border-t border-dotted border-white/20 pt-8 w-full" />
              </div>

              {/* Research Domains */}
              <div className="mb-12">
                <h2 className="text-2xl mb-6 font-bold">研究分野 / RESEARCH DOMAINS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Core Research */}
                  <div>
                    <h3 className="text-xl mb-4">
                      <span className="mr-2">⚙</span>
                      コア・リサーチ / CORE RESEARCH
                    </h3>
                    <div className="space-y-2">
                      <div className="border border-white/20 p-2">
                        <span className="text-blue-400 mr-2">◇</span>
                        Deep Learning Architecture Research
                      </div>
                      <div className="border border-white/20 p-2">
                        <span className="text-blue-400 mr-2">◇</span>
                        Inference Optimization
                      </div>
                      <div className="border border-white/20 p-2">
                        <span className="text-blue-400 mr-2">◇</span>
                        Low Level Programming
                      </div>
                    </div>
                  </div>

                  {/* Current Goals */}
                  <div>
                    <h3 className="text-xl mb-4">
                      <span className="mr-2">▷</span>
                      現在の目標 / CURRENT GOALS
                    </h3>
                    <div className="space-y-2">
                      <div className="border border-white/20 p-2">
                        <span className="text-green-400 mr-2">⊕</span>
                        Scaling ML Models
                      </div>
                      <div className="border border-white/20 p-2">
                        <span className="text-green-400 mr-2">⊕</span>
                        Low-End Device Optimization
                      </div>
                      <div className="border border-white/20 p-2">
                        <span className="text-green-400 mr-2">⊕</span>
                        CPU/GPU Architecture Research
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offline Mode */}
              <div className="mb-8">
                <h2 className="text-2xl mb-4 font-bold">オフライン・モード / OFFLINE MODE</h2>
                <div className="border border-white/20 p-4 hover:border-white/40 transition-colors duration-300">
                  <p className="opacity-90 font-mono">
                    Beyond the terminal, I create games, write blog posts, make digital art, 
                    and explore virtual worlds. You can find my thoughts on my blog or follow 
                    my journey on social media.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'blog' && <CyberpunkBlog />}
          {activeSection === 'contact' && <CyberpunkContact />}
        </div>
      </div>

      <footer className="p-4 mt-8 opacity-70 hover:opacity-100 transition-opacity duration-300">
        <p className="text-center">© 2024 スノーエクリプス</p>
      </footer>
    </div>
  );
};

export default CyberpunkPortfolio;