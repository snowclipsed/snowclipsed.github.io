import { getAllPosts } from '../lib/markdown';
import CyberpunkPortfolio from '../components/CyberpunkPortfolio';

export default async function Home() {
  const posts = await getAllPosts();
  return <CyberpunkPortfolio posts={posts} />;
}