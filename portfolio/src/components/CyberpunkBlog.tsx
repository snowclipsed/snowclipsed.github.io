import React from 'react';
import { Terminal } from 'lucide-react';

const CyberpunkBlog = () => {
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
    <div className="space-y-6 animate-fade-in">
      {/* ASCII Art Header with CRT Effect */}
      <pre className="text-xs md:text-sm lg:text-base overflow-x-auto p-4 border border-white 
        hover:bg-white hover:text-black transition-colors duration-300 cursor-crosshair font-mono relative group">
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        {`
    ╔═══════════════════════════════════╗
    ║  BLOG SYSTEM v2.0                 ║
    ║  STATUS: INITIALIZED              ║
    ║  ENTRIES: LOADING...             ║
    ╚═══════════════════════════════════╝`}
      </pre>

      {/* Blog Posts with Enhanced Styling */}
      <div className="space-y-4">
        {blogPosts.map((post, index) => (
          <div 
            key={post.title}
            className="border border-white p-4 relative group cursor-pointer"
            style={{ 
              transform: `translateX(${index * 5}px)`,
              zIndex: blogPosts.length - index 
            }}
          >
            {/* Glitch Effect Container */}
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
                <h3 className="text-xl font-bold group-hover:text-red-500 transition-colors duration-300">{post.title}</h3>
                <span className="opacity-70 text-sm md:text-base font-mono">{post.date}</span>
              </div>
              <p className="opacity-80 group-hover:opacity-100 transition-opacity duration-300">{post.preview}</p>
            </div>

            {/* Hover Border Animation */}
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