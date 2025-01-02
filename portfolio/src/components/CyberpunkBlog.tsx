import React, { useState, useEffect } from 'react';
import { Terminal, Tag, Calendar, User, ArrowLeft, Search, SortAsc, SortDesc, Filter } from 'lucide-react';
import type { BlogPost } from '../lib/markdown';
import Script from 'next/script';
import Image from 'next/image';

interface CyberpunkBlogProps {
  posts?: BlogPost[];
}

interface MathJaxWindow extends Window {
  MathJax?: {
    typeset: () => void;
  };
}

const CyberpunkBlog: React.FC<CyberpunkBlogProps> = ({ posts = [] }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [mathjaxLoaded, setMathJaxLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  
  const POPULAR_TAGS_COUNT = 5;

  // Get unique tags and their counts
  const tagCounts = posts.flatMap(post => post.tags).reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get all unique tags
  const allTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

  // Filter tags based on search
  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  // Get popular tags for initial display
  const popularTags = allTags.slice(0, POPULAR_TAGS_COUNT);

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => post.tags.includes(tag));
    return matchesSearch && matchesTags;
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  useEffect(() => {
    const mathJaxWindow = window as unknown as MathJaxWindow;
    if (selectedPost && mathjaxLoaded && mathJaxWindow.MathJax?.typeset) {
      mathJaxWindow.MathJax.typeset();
    }
  }, [selectedPost, mathjaxLoaded]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
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
            className="flex items-center gap-2 border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors duration-100 group"
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
                <div className="relative w-full h-64 mb-6">
                  <Image 
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>
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
      {/* Search and Filter Controls */}
      <div className="border transition-colors duration-100 dark:border-white border-black p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-100 dark:text-white/60 text-black/60" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full transition-colors duration-100 
              dark:bg-black bg-white 
              dark:text-white text-black 
              dark:border-white/30 border-black/30 
              dark:focus:border-white/60 focus:border-black/60 
              border py-2 pl-10 pr-4 
              dark:placeholder-white/50 placeholder-black/50 
              focus:outline-none"
          />
        </div>

        {/* Tags Filter */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter by tags:</span>
            </div>
            <button
              onClick={() => setIsTagsExpanded(!isTagsExpanded)}
              className="text-sm border transition-colors duration-100
                dark:border-white/30 border-black/30 
                dark:hover:border-white/60 hover:border-black/60 
                px-3 py-1"
            >
              {isTagsExpanded ? 'Show Less' : 'Show All Tags'}
            </button>
          </div>

          {/* Popular/Selected Tags */}
          <div className="flex flex-wrap gap-2">
            {(isTagsExpanded ? [] : popularTags).map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`flex items-center gap-1 px-3 py-1 text-sm border group transition-colors duration-100
                  ${selectedTags.includes(tag)
                    ? 'dark:border-white border-black dark:bg-white bg-black dark:text-black text-white'
                    : 'dark:border-white/30 border-black/30 dark:hover:border-white/60 hover:border-black/60'}
                  `}
              >
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
                <span className="ml-1 text-xs opacity-60 group-hover:opacity-100">
                  ({tagCounts[tag]})
                </span>
              </button>
            ))}
          </div>

          {/* Expanded Tags Section */}
          {isTagsExpanded && (
            <div className="border transition-colors duration-100 dark:border-white/30 border-black/30 p-4 space-y-4">
              {/* Tag Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-100 dark:text-white/60 text-black/60" />
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={tagSearchQuery}
                  onChange={(e) => setTagSearchQuery(e.target.value)}
                  className="w-full transition-colors duration-100 
                    dark:bg-black bg-white 
                    dark:text-white text-black 
                    dark:border-white/30 border-black/30 
                    dark:focus:border-white/60 focus:border-black/60 
                    border py-2 pl-10 pr-4 
                    dark:placeholder-white/50 placeholder-black/50 
                    focus:outline-none"
                />
              </div>

              {/* All Tags */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                {filteredTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`flex items-center gap-1 px-3 py-1 text-sm border group transition-colors duration-100
                      ${selectedTags.includes(tag)
                        ? 'dark:border-white border-black dark:bg-white bg-black dark:text-black text-white'
                        : 'dark:border-white/30 border-black/30 dark:hover:border-white/60 hover:border-black/60'}
                      `}
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                    <span className="ml-1 text-xs opacity-60 group-hover:opacity-100">
                      ({tagCounts[tag]})
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected Tags Section */}
              {selectedTags.length > 0 && (
                <div className="border-t transition-colors duration-100 dark:border-white/20 border-black/20 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">Selected Tags:</span>
                    <button
                      onClick={() => setSelectedTags([])}
                      className="text-xs border transition-colors duration-100
                        dark:border-white/30 border-black/30 
                        dark:hover:border-white/60 hover:border-black/60 
                        px-2 py-1"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="flex items-center gap-1 px-3 py-1 text-sm border transition-colors duration-100
                          dark:border-white border-black 
                          dark:bg-white bg-black 
                          dark:text-black text-white 
                          group"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                        <span className="ml-1">×</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sort Control */}
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-3 py-1 border transition-colors duration-100
            dark:border-white/30 border-black/30 
            dark:hover:border-white/60 hover:border-black/60"
        >
          {sortOrder === 'asc' ? (
            <SortAsc className="w-4 h-4" />
          ) : (
            <SortDesc className="w-4 h-4" />
          )}
          Sort by Date ({sortOrder === 'asc' ? 'Oldest' : 'Newest'} First)
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4 mt-4">
        {filteredPosts.map((post, index) => (
          <div 
            key={post.slug}
            className="border transition-colors duration-100
              dark:border-white border-black
              p-4 relative group cursor-pointer"
            style={{ 
              transform: `translateX(${index * 5}px)`,
              zIndex: filteredPosts.length - index 
            }}
            onClick={() => setSelectedPost(post)}
          >
            <div className="relative">
              <div className="opacity-80 absolute -left-0.5 -top-0.5 text-red-500 pointer-events-none 
                group-hover:translate-x-1 transition-transform duration-100">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="opacity-80 absolute -left-0.5 top-0.5 text-blue-500 pointer-events-none 
                group-hover:-translate-x-1 transition-transform duration-100">
                <Terminal className="w-4 h-4" />
              </div>
              <Terminal className="w-4 h-4" />
            </div>

            <div className="mt-2">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                <h3 className="text-xl font-bold group-hover:text-red-500 transition-colors duration-100">
                  {post.title}
                </h3>
                <span className="opacity-70 text-sm md:text-base font-mono">
                  {formatDate(post.date)}
                </span>
              </div>
              <p className="opacity-80 group-hover:opacity-100 transition-opacity duration-100">
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

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-current to-transparent" />
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-current to-transparent" />
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-current to-transparent" />
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-current to-transparent" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CyberpunkBlog;