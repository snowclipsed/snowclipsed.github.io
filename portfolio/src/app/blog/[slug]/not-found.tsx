import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-xl">Post Not Found</h2>
        <p className="text-gray-500">The blog post you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="text-blue-500 hover:underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}