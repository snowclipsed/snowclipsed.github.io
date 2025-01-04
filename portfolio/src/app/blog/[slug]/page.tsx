import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CyberpunkShell from '../../../components/CyberpunkShell';
import { getAllPosts, getPostBySlug, BlogPost as MarkdownBlogPost } from '../../../lib/markdown';

// Update the props type to match Next.js expectations more closely
type Params = {
  slug: string;
};

type Props = {
  params: Params;
};

export default async function BlogPost({ params }: Props) {
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

// Update metadata generation to match the new Props type
export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

// Static params generation remains the same
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}