'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    MathJax: any;
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
      window.MathJax = {
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

      script.addEventListener('load', () => {
        console.log('MathJax script loaded');
        window.MathJax.typesetPromise?.();
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