'use client';

// src/components/PageWrapper.tsx
import { useEffect, useState } from 'react';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return a placeholder with the same layout structure to prevent CLS
    return (
      <div className="min-h-screen w-full max-w-4xl mx-auto opacity-0">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {children}
    </div>
  );
}