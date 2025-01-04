import CyberpunkShell from '../../components/CyberpunkShell';
import { getAllPosts } from '../../lib/markdown';

export default async function BlogPage() {
  const posts = await getAllPosts();
  return <CyberpunkShell posts={posts} />;
}