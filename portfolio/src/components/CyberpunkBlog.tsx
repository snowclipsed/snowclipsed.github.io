'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Tag, Calendar, User, ArrowLeft } from 'lucide-react';
import type { BlogPost } from '../lib/markdown';
import CyberpunkPerlin from './CyberpunkPerlin';
import Script from 'next/script';

interface CyberpunkBlogProps {
  posts?: BlogPost[];
}

const CyberpunkBlog: React.FC<CyberpunkBlogProps> = ({ posts = [] }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [mathjaxLoaded, setMathJaxLoaded] = useState(false);

  useEffect(() => {
    if (selectedPost && mathjaxLoaded && (window as any).MathJax) {
      // Typeset the math when post content changes or MathJax loads
      (window as any).MathJax.typeset();
    }
  }, [selectedPost, mathjaxLoaded]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.');
  };

  if (selectedPost) {
    return (
      <>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.js"
          strategy="lazyOnload"
          onLoad={() => setMathJaxLoaded(true)}
        />
        <div className="space-y-6 animate-fade-in">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Posts
          </button>
          
          <article className="prose prose-invert max-w-none">
            <div className="border border-white p-6">
              <h1 className="text-3xl font-bold mb-4 font-mono">{selectedPost.title}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6 text-sm opacity-80 font-mono">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedPost.date)}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {selectedPost.author}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {selectedPost.image && (
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover mb-6 rounded-lg"
                />
              )}

              <div 
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                className="prose prose-invert prose-pre:bg-gray-900 prose-pre:border prose-pre:border-white/20 max-w-none font-mono"
              />
            </div>
          </article>
        </div>
      </>
    );
  }


  return (
    <div className="space-y-4 animate-fade-in">
      {/* Perlin Noise Visualization */}
      <div className="border border-white bg-black">
        <CyberpunkPerlin />
      </div>

      {/* Posts List */}
      <div className="space-y-4 mt-4">
        {posts.map((post, index) => (
          <div 
            key={post.slug}
            className="border border-white p-4 relative group cursor-pointer"
            style={{ 
              transform: `translateX(${index * 5}px)`,
              zIndex: posts.length - index 
            }}
            onClick={() => setSelectedPost(post)}
          >
            <div className="relative">
              <div className="opacity-80 absolute -left-0.5 -top-0.5 text-red-500 pointer-events-none 
                group-hover:translate-x-1 transition-transform duration-300">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="opacity-80 absolute -left-0.5 top-0.5 text-blue-500 pointer-events-none 
                group-hover:-translate-x-1 transition-transform duration-300">
                <Terminal className="w-4 h-4" />
              </div>
              <Terminal className="w-4 h-4" />
            </div>

            <div className="mt-2">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                <h3 className="text-xl font-bold group-hover:text-red-500 transition-colors duration-300">
                  {post.title}
                </h3>
                <span className="opacity-70 text-sm md:text-base font-mono">
                  {formatDate(post.date)}
                </span>
              </div>
              <p className="opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {post.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="text-sm opacity-60 flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent" />
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CyberpunkBlog;