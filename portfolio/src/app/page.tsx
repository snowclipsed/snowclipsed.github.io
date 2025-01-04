// src/app/page.tsx
import { getAllPosts } from '../lib/markdown';
import CyberpunkPortfolio from '../components/CyberpunkPortfolio';
import MainContent from '../components/MainContent';

export default async function Home() {
  const posts = await getAllPosts();
  return (
    <CyberpunkPortfolio>
      <MainContent />
    </CyberpunkPortfolio>
  );
}