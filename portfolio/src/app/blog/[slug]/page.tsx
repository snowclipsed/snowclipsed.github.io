import { getPostBySlug, getAllPosts } from '../../../lib/markdown';
import CyberpunkPortfolio from '../../../components/CyberpunkPortfolio';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export default async function BlogPost({ params }: Props) {
  const post = await getPostBySlug(params.slug).catch(() => null);
  
  if (!post) {
    notFound();
  }

  const posts = await getAllPosts();
  
  return (
    <CyberpunkPortfolio 
      posts={posts} 
      initialSection="blog"
      initialPost={post} 
    />
  );
}