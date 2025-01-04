'use client';  // Add this at the top

// src/components/MainContent.tsx
import React from 'react';
import { Brain, Target } from 'lucide-react';
import CyberpunkLorenz from './CyberpunkLorenz';

const MainContent = () => {
  return (
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
              <Brain className="w-5 h-5"/> コア・リサーチ / CORE RESEARCH
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
  );
};

export default MainContent;