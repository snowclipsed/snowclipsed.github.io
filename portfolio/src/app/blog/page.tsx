// src/app/blog/page.tsx
import { getAllPosts } from '../../lib/markdown';
import CyberpunkPortfolio from '../../components/CyberpunkPortfolio';
import CyberpunkBlog from '../../components/CyberpunkBlog';

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <CyberpunkPortfolio>
      <CyberpunkBlog posts={posts} />
    </CyberpunkPortfolio>
  );
}