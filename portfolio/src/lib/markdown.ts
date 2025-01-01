// src/lib/markdown.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { marked, Tokens} from 'marked';
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

interface ImageProps {
  href?: string;
  text?: string;
  title?: string;
}

// Custom renderer to handle math and image paths
const renderer = new marked.Renderer();

// Handle math blocks
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
  
  // If the image path starts with ./ or ../, assume it's relative to the posts directory
  let processedHref = image.href;
  if (image.href.startsWith('./') || image.href.startsWith('../')) {
    processedHref = `/blog-images/${image.href.split('/').pop()}`;
  }
  return `<img src="${processedHref}" alt="${image.text || ''}" title="${image.title || ''}" class="rounded-lg">`;
};

// Configure marked with the custom renderer
// Configure marked with the custom renderer
marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
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