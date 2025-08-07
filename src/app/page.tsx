
'use client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    if (!loading) {
      if (isMounted) {
        if (user) {
          router.replace('/dashboard');
        } else {
          router.replace('/login');
        }
      }
    }

    return () => {
      isMounted = false;
    };
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    </div>
  );
}
