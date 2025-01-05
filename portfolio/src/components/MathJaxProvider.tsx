'use client';

import React, { useEffect, useRef } from 'react';

interface MathJaxConfig {
  tex: {
    inlineMath: string[][];
    displayMath: string[][];
    processEscapes: boolean;
    processEnvironments: boolean;
  };
  options: {
    skipHtmlTags: string[];
    processHtmlClass: string;
  };
  startup: {
    pageReady: () => Promise<void>;
  };
}

// Define the complete MathJax interface
interface MathJaxObject {
  typesetPromise?: () => Promise<void>;
  tex?: MathJaxConfig['tex'];
  options?: MathJaxConfig['options'];
  startup?: MathJaxConfig['startup'];
  Hub?: any;
  Ajax?: any;
  Message?: any;
  HTML?: any;
  Callback?: any;
  InputJax?: any;
  OutputJax?: any;
  ElementJax?: any;
  Localization?: any;
}

declare global {
  interface Window {
    MathJax?: MathJaxObject;
  }
}

interface MathJaxProviderProps {
  children: React.ReactNode;
}

const MathJaxProvider: React.FC<MathJaxProviderProps> = ({ children }) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.js';
      script.async = true;
      
      // Configure MathJax before loading the script
      const mathJaxConfig = {
        tex: {
          inlineMath: [['\\(', '\\)']],
          displayMath: [['$$', '$$']],
          processEscapes: true,
          processEnvironments: true,
        },
        options: {
          skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
          processHtmlClass: 'math-block|math-inline',
        },
        startup: {
          pageReady: () => {
            console.log('MathJax is ready');
            return Promise.resolve();
          }
        }
      };

      // Instead of direct assignment, extend the existing MathJax object
      window.MathJax = {
        ...window.MathJax,
        ...mathJaxConfig
      };

      script.addEventListener('load', () => {
        console.log('MathJax script loaded');
        window.MathJax?.typesetPromise?.();
      });

      document.head.appendChild(script);
      initialized.current = true;
    } else if (window.MathJax) {
      window.MathJax.typesetPromise?.();
    }
  }, []);

  // Re-render MathJax when content changes
  useEffect(() => {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [children]);

  return <>{children}</>;
};

export default MathJaxProvider;