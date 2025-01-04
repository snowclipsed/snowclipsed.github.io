'use client';

import { useEffect, useState } from 'react';
import CyberpunkBlog from './CyberpunkBlog';
import type { BlogPost } from '../lib/markdown';

interface BlogContentProps {
  initialPosts: BlogPost[];
}

export default function BlogContent({ initialPosts }: BlogContentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading state
  }

  return <CyberpunkBlog posts={initialPosts} />;
}