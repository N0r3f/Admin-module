import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AuthLayout({ children, requireAuth = true }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === 'loading';

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !session) {
        router.push('/auth/signin');
      } else if (!requireAuth && session) {
        router.push('/');
      }
    }
  }, [session, loading, requireAuth, router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return children;
}
