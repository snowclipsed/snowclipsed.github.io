// src/app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CyberpunkShell from '../../../components/CyberpunkShell';
import { getAllPosts, getPostBySlug } from '../../../lib/markdown';

type Params = {
  slug: string;
};

export default async function BlogPost({
  params: rawParams,
}: {
  params: Promise<Params>;
}) {
  const params = await rawParams;

  if (!params?.slug) {
    return notFound();
  }

  try {
    const posts = await getAllPosts();
    const post = posts.find((p) => p.slug === params.slug);

    if (!post) {
      return notFound();
    }

    return <CyberpunkShell posts={posts} initialPost={post} />;
  } catch (error) {
    console.error('Error loading blog post:', error);
    return notFound();
  }
}

export async function generateMetadata({
  params: rawParams,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const params = await rawParams;

  if (!params?.slug) {
    return {
      title: 'Post Not Found',
    };
  }

  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    return {
      title: post.title,
      description: post.description,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Post Not Found',
    };
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
