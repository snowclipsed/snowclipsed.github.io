import CyberpunkShell from '../../../components/CyberpunkShell';
import { getAllPosts, getPostBySlug } from '../../../lib/markdown';
import { notFound } from 'next/navigation';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  try {
    const [post, posts] = await Promise.all([
      getPostBySlug(params.slug),
      getAllPosts()
    ]);
    
    if (!post) notFound();
    
    return <CyberpunkShell posts={posts} initialPost={post} />;
  } catch {
    notFound();
  }
}