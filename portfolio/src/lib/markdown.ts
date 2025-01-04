// src/lib/markdown.ts
import path from 'path';
import matter from 'gray-matter';
import { marked, Tokens } from 'marked';
import { cache } from 'react';
import { readFile, readdir } from 'fs/promises';

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
renderer.code = ({ text, lang }: { text: string, lang?: string }) => {
  if (lang === 'math') {
    return `<div class="math-display">$$${text}$$</div>`;
  }
  return `<pre><code class="language-${lang}">${text}</code></pre>`;
};

// Handle inline math with type checking
const originalParagraph = renderer.paragraph.bind(renderer);
renderer.paragraph = (token: Tokens.Paragraph) => {
  // Check if the token is a paragraph token
  if (token.type !== 'paragraph') {
    return originalParagraph(token);
  }

  // Process the text of the paragraph token
  const processedTokens = token.tokens.map(subToken => {
    if (subToken.type === 'text') {
      // Replace inline math expressions in text tokens
      return {
        ...subToken,
        text: subToken.text.replace(/\$([^\$]+)\$/g, (_match: string, math: string) => {
          return `\\(${math}\\)`;
        })
      };
    }
    return subToken;
  });

  // Create a new paragraph token with processed tokens
  return originalParagraph({
    ...token,
    tokens: processedTokens
  });
};

renderer.image = (image: Tokens.Image) => {
  if (!image.href) return '';
  
  let processedHref = image.href;
  if (image.href.startsWith('./') || image.href.startsWith('../')) {
    processedHref = `/blog-images/${image.href.split('/').pop()}`;
  }

  // Parse size and center options from title
  const sizeMatch = image.title?.match(/\[size:(sm|md|lg|xl)\]/);
  const shouldCenter = image.title?.includes('[center]');
  const cleanTitle = image.title
    ?.replace(/\[size:(sm|md|lg|xl)\]/, '')
    ?.replace('[center]', '')
    ?.trim();

  // Define size classes with proper typing
  const sizeClasses = {
    sm: 'w-1/3',
    md: 'w-1/2',
    lg: 'w-2/3',
    xl: 'w-full'
  } as const;  // Make the object immutable

  // Type-safe size class selection
  type SizeKey = keyof typeof sizeClasses;
  const size = sizeMatch ? sizeMatch[1] as SizeKey : 'xl';
  const sizeCls = sizeClasses[size];
  
  const imgTag = `<img src="${processedHref}" 
    alt="${image.text || ''}" 
    title="${cleanTitle || ''}" 
    class="rounded-lg ${sizeCls}"
  >`;
  
  return shouldCenter 
    ? `<div class="flex justify-center my-8">${imgTag}</div>`
    : imgTag;
};

// Configure marked with the custom renderer
marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost> => {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = await readFile(fullPath, 'utf8');
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
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    throw error;
  }
});

export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const files = await readdir(postsDirectory);
    
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