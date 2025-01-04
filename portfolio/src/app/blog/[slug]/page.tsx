import { Metadata } from 'next';
import CyberpunkShell from '../../../components/CyberpunkShell';
import { getAllPosts, getPostBySlug } from '../../../lib/markdown';
import { notFound } from 'next/navigation';

interface BlogPostProps {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function BlogPost({ params }: BlogPostProps) {
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

// Optionally, you can also generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: post.title,
    description: post.description
  };
}

// Generate static params if you're using static site generation
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}