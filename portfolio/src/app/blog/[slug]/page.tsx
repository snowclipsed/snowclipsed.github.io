// src/app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CyberpunkShell from '../../../components/CyberpunkShell';
import MathJaxProvider from '../../../components/MathJaxProvider';
import { getAllPosts, getPostBySlug } from '../../../lib/markdown';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  
  if (!slug) {
    return notFound();
  }

  try {
    const [posts, post] = await Promise.all([
      getAllPosts(),
      getPostBySlug(slug)
    ]);

    if (!post) {
      return notFound();
    }

    return (
      <MathJaxProvider>
        <CyberpunkShell posts={posts} initialPost={post} />
      </MathJaxProvider>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    return notFound();
  }
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;
  
  if (!slug) {
    return {
      title: 'Post Not Found',
    };
  }

  try {
    const post = await getPostBySlug(slug);

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
    const params = posts.map((post) => ({
      slug: post.slug,
    }));
    console.log('Generated static params:', params);
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}