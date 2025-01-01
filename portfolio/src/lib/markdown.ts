// src/lib/markdown.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { cache } from 'react';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  image: string;
  description: string;
  content: string;
};

// Custom renderer to handle math and image paths
const renderer = new marked.Renderer();

// Handle math blocks
renderer.code = (code, language) => {
  if (language === 'math') {
    return `<div class="math-display">$$${code}$$</div>`;
  }
  return `<pre><code class="language-${language}">${code}</code></pre>`;
};

// Handle inline math with type checking
const originalParagraph = renderer.paragraph.bind(renderer);
renderer.paragraph = (text) => {
  if (typeof text !== 'string') {
    return originalParagraph(text);
  }

  // Process inline math expressions
  const processed = text.replace(/\$([^\$]+)\$/g, (match, math) => {
    return `\\(${math}\\)`;
  });

  return originalParagraph(processed);
};

// Simplify image paths
renderer.image = (href, title, text) => {
  if (!href) return '';
  
  // If the image path starts with ./ or ../, assume it's relative to the posts directory
  if (href.startsWith('./') || href.startsWith('../')) {
    href = `/blog-images/${href.split('/').pop()}`;
  }
  return `<img src="${href}" alt="${text || ''}" title="${title || ''}" class="rounded-lg">`;
};

// Configure marked with the custom renderer
marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: true
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost> => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = await fs.readFile(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    title: data.title,
    date: data.date,
    author: data.author,
    tags: data.tags || [],
    image: data.image || '',
    description: data.description,
    content: await Promise.resolve(marked.parse(content))
  };
});

export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  try {
    const files = await fs.readdir(postsDirectory);
    
    const slugs = files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));

    const posts = await Promise.all(
      slugs.map(slug => getPostBySlug(slug))
    );

    return posts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
});