import path from 'path';
import matter from 'gray-matter';
import { marked, Tokens } from 'marked';
import { cache } from 'react';
import { readFile, readdir } from 'fs/promises';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';

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

// Create a new instance of our custom renderer
const renderer = new marked.Renderer();

// Custom code block renderer
renderer.code = ({ text, lang }: Tokens.Code) => {
  if (!lang) {
    return `<pre class="my-4 p-4 bg-black/5 dark:bg-white/5 rounded-lg overflow-x-auto"><code>${text}</code></pre>`;
  }

  // Ensure the language is loaded in Prism
  const validLanguage = Prism.languages[lang] ? lang : 'plaintext';

  // Highlight the code
  const highlightedCode = Prism.highlight(
    text,
    Prism.languages[validLanguage],
    validLanguage
  );

  // Return the highlighted code with cyberpunk styling
  return `
    <div class="relative my-4 group">
      <div class="absolute -inset-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      <div class="relative">
        <div class="flex items-center justify-between px-4 py-2 bg-black/10 dark:bg-white/10 border-b border-black/20 dark:border-white/20">
          <span class="text-sm opacity-60">${validLanguage}</span>
          <button 
            class="px-2 py-1 text-xs border border-transparent hover:border-current opacity-60 hover:opacity-100 transition-all duration-200"
            onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)"
          >
            Copy
          </button>
        </div>
        <pre class="p-4 bg-black/5 dark:bg-white/5 overflow-x-auto">
          <code class="language-${validLanguage}">${highlightedCode}</code>
        </pre>
      </div>
    </div>
  `;
};

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
marked.use({ 
  renderer,
  breaks: true,
  gfm: true
});

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