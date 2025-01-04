// src/app/blog/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from '../../../lib/markdown';
import CyberpunkPortfolio from '../../../components/CyberpunkPortfolio';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { params } = props;
  const resolvedParams = await params;
  
  // Fetch the post data
  const post = await getPostBySlug(resolvedParams.slug).catch(() => null);
  
  // Get the parent metadata
  const previousImages = (await parent).openGraph?.images || [];

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
      images: post.image ? [post.image, ...previousImages] : previousImages,
    },
  };
}

export default async function BlogPost(props: Props) {
  const { params } = props;
  const resolvedParams = await params;
  
  try {
    const [post, posts] = await Promise.all([
      getPostBySlug(resolvedParams.slug),
      getAllPosts()
    ]);

    if (!post) {
      notFound();
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <CyberpunkPortfolio 
          posts={posts} 
          initialSection="blog"
          initialPost={post} 
        />
      </Suspense>
    );
  } catch (error) {
    notFound();
  }
}