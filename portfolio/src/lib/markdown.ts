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

// In your markdown.ts file, update the image renderer:
// Create a new instance of our custom renderer
const renderer = new marked.Renderer();

renderer.image = (image: Tokens.Image) => {
  if (!image.href) return '';
  
  // Process the href
  let processedHref = image.href;
  if (!image.href.startsWith('http')) {
    // Remove any leading ./ or ../ and ensure proper path
    const cleanPath = image.href.replace(/^[./\\]+/, '');
    processedHref = cleanPath.startsWith('images/') 
      ? `/${cleanPath}`
      : `/images/${cleanPath}`;
  }

  // Parse size and center options from title
  const sizeMatch = image.title?.match(/\[size:(sm|md|lg|xl)\]/);
  const shouldCenter = image.title?.includes('[center]');
  const cleanTitle = image.title
    ?.replace(/\[size:(sm|md|lg|xl)\]/, '')
    ?.replace('[center]', '')
    ?.trim();

  // Define size classes
  const sizeClasses = {
    sm: 'w-1/3',
    md: 'w-1/2',
    lg: 'w-2/3',
    xl: 'w-full'
  } as const;

  const size = sizeMatch ? (sizeMatch[1] as keyof typeof sizeClasses) : 'xl';
  const sizeCls = sizeClasses[size];
  
  // Create img tag without line breaks
  const imgTag = `<img src="${processedHref}" alt="${image.text || ''}" title="${cleanTitle || ''}" class="rounded-lg ${sizeCls}">`;
  
  // Return centered or normal image
  return shouldCenter 
    ? `<div class="flex justify-center my-8">${imgTag}</div>`
    : imgTag;
};



// Configure marked with our custom renderer
marked.use({ renderer });

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost> => {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = await readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Ensure synchronous parsing by using marked.parse with the sync option
    const parsedContent = marked.parse(content, { async: false }) as string;
    
    return {
      slug,
      title: data.title,
      date: data.date,
      author: data.author,
      tags: data.tags || [],
      image: data.image || '',
      description: data.description,
      content: parsedContent
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