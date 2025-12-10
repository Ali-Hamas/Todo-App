'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/auth-context';

export default function Home() {
  const { session, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (session) {
        // If user is logged in, redirect to dashboard
        router.replace('/dashboard');
      } else {
        // If user is not logged in, redirect to login
        router.replace('/login');
      }
    }
  }, [session, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-xl">Loading...</div>
    </div>
  );
}
