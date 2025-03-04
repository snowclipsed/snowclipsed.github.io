'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Terminal, Book, Network, Brain, Target } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import CyberpunkBlog from './CyberpunkBlog';
import CyberpunkContact from './CyberpunkContact';
import type { BlogPost } from '../lib/markdown';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';


interface CyberpunkShellProps {
  posts?: BlogPost[];
  initialPost?: BlogPost;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const DynamicLorenz = dynamic(() => import('./CyberpunkLorenz'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center">
      Loading Visualization...
    </div>
  )
});

class LorenzErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LorenzErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4">Failed to load visualization</div>;
    }

    return this.props.children;
  }
}

export default function CyberpunkShell({ posts = [], initialPost }: CyberpunkShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = useMemo(() => [
    { id: '/', icon: <Terminal className="w-5 h-5" />, label: 'メイン' },
    { id: '/blog', icon: <Book className="w-5 h-5" />, label: 'ブログ' },
    { id: '/contact', icon: <Network className="w-5 h-5" />, label: 'コンタクト' }
  ], []);
    
    useEffect(() => {
      navItems.forEach(({ id }) => {
        router.prefetch(id);
      });
    }, [router, navItems]);

  // Debug scroll events
  useEffect(() => {
    const handleScroll = () => {
      console.log('Scroll event detected', {
        pathname,
        currentHref: window.location.href,
        currentPath: window.location.pathname
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleNavigation = useCallback((path: string) => {
    if (path === pathname) return;
    
    // Remove references to glitch effect
    router.push(path);
  }, [pathname, router]);


   // Only render content after initial mount to prevent hydration issues
   const renderContent = () => {
    // Home page with Lorenz
    if (pathname === '/' || pathname === '') {
        return (
            <div className="space-y-8">
                 <div className="mb-12">
                  <h2 className="text-2xl mb-4 font-bold">私について / CHAOS ENGINE</h2>
                  <div className="w-full">
                    <LorenzErrorBoundary>
                      <Suspense>
                        <DynamicLorenz />
                      </Suspense>
                    </LorenzErrorBoundary>
                  </div>
                </div>

          <div className="mt-8 border-t border-dotted transition-colors duration-100 
            dark:border-white/20 border-black/20 pt-8 w-full" />

          {/* Introduction */}
          <div className="mb-12 mt-8">
            <h2 className="text-2xl mb-6 font-bold">研究分野 / ABOUT ME</h2>
            <div className="space-y-4 opacity-90">
              <p>Hi, I am snow/snowclipsed.</p>
              <p>Welcome to my site. I am a machine learning engineer specializing in 
                deep learning architecture research and inference optimization.</p>
              <p>I primarily focus on large language model optimization with transformers, 
                while also pursuing research in deep learning architecture design. My goal 
                is to make AI more accessible and efficient, with a particular emphasis 
                on lower-end hardware.</p>
                <p className="opacity-90 font-mono">
                    If I&apos;m not diving deep into neural networks, I am probably nerd-sniped by something else.
                    I&apos;ve been enjoying writing <a href='https://gist.github.com/snowclipsed/24aebbdd51218f4e17ad428630cc91d6'> <u>high performance CPU kernels</u> </a> and learning to write minecraft shaders (reveal soon!).
                </p>
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
                    Low-level and GPU Programming
                  </div>
                  <div className="border transition-colors duration-100 
                    dark:border-white/20 border-black/20 p-2 
                    dark:hover:border-white/40 hover:border-black/40">
                    <span className="text-blue-400 mr-2">◇</span>
                    Applied Machine Learning
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
                    Scaling ML Models for Low-End Devices
                  </div>
                  <div className="border transition-colors duration-100 
                    dark:border-white/20 border-black/20 p-2 
                    dark:hover:border-white/40 hover:border-black/40">
                    <span className="text-green-400 mr-2">⊕</span>
                    Mech-Interp and Visualization
                  </div>
                  <div className="border transition-colors duration-100 
                    dark:border-white/20 border-black/20 p-2 
                    dark:hover:border-white/40 hover:border-black/40">
                    <span className="text-green-400 mr-2">⊕</span>
                    Graphics Shaders
                  </div>
                  <div className="border transition-colors duration-100 
                    dark:border-white/20 border-black/20 p-2 
                    dark:hover:border-white/40 hover:border-black/40">
                    <span className="text-green-400 mr-2">⊕</span>
                    Gaussian Splats and NeRFs
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
              my journey on <a href='https://x.com/snowclipsed'><u>social media</u></a>.
            </p>
          </div>
        </div>
      );
    }
    
    // Blog pages
    if (pathname === '/blog' || pathname === '/blog/') {
      return <CyberpunkBlog posts={posts} />;
  }
    
    if (pathname.startsWith('/blog/')) {
      if (initialPost) {
        return (
          <article className="prose dark:prose-invert max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: initialPost.content }}
              className="math-content"
            />
            <style jsx global>{`
              .math-block {
                @apply my-4 overflow-x-auto;
              }
              .MathJax {
                @apply dark:text-white text-black;
              }
            `}</style>
          </article>
        );
      }
    }
    
    // Contact Page
    if (pathname === '/contact' || pathname === '/contact/') {
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
        <div className="transition-all duration-100">
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
                            ${pathname === id || (id === '/' && pathname === '') 
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
        <p className="text-center">© 2025 snowclipsed / スノーエクリプス</p>
      </footer>
    </div>
  );
}