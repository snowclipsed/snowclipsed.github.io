import { getPostBySlug, getAllPosts } from '../../../lib/markdown';
import CyberpunkPortfolio from '../../../components/CyberpunkPortfolio';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug).catch(() => null);
  
  if (!post) {
    return {
      title: 'Post Not Found - Snowclipsed',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} - Snowclipsed`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
    },
  };
}

// We need to make this async again to await the promises
export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const posts = await getAllPosts();
  
  if (!post) {
    notFound();
  }

  return (
    <CyberpunkPortfolio 
      posts={posts} 
      initialSection="blog"
      initialPost={post} 
    />
  );
}