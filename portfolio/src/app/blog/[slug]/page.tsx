import { getPostBySlug, getAllPosts } from '../../../lib/markdown';
import CyberpunkPortfolio from '../../../components/CyberpunkPortfolio';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    return {
      title: `${post.title} - Snowclipsed`,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        images: post.image ? [post.image] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found - Snowclipsed',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function BlogPost({ params, searchParams }: Props) {
  try {
    const post = await getPostBySlug(params.slug);
    const posts = await getAllPosts();
    
    return (
      <CyberpunkPortfolio 
        posts={posts} 
        initialSection="blog"
        initialPost={post} 
      />
    );
  } catch (error) {
    notFound();
  }
}