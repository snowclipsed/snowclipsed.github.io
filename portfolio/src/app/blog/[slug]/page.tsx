import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CyberpunkShell from '../../../components/CyberpunkShell';
import { getAllPosts, getPostBySlug } from '../../../lib/markdown';

// Explicitly type for Next.js page component
type Params = {
  slug: string;
};

export default async function BlogPost({ params }: { params: Params }) {
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

export async function generateMetadata({ 
  params 
}: { 
  params: Params 
}): Promise<Metadata> {
  try {
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
  } catch {
    return {
      title: 'Post Not Found'
    };
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}