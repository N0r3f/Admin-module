import { useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import MainLayout from '../components/Layout/MainLayout';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Protection client-side
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session.user.role === 'ADMIN') {
      router.push('/admin/users');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div>Redirection en cours...</div>
    </MainLayout>
  );
}

// Protection server-side
export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  if (session.user.role === 'ADMIN') {
    return {
      redirect: {
        destination: '/admin/users',
        permanent: false,
      },
    };
  }

  return {
    props: { session }
  };
}
