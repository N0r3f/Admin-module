import { getSession } from 'next-auth/react';

export function withAuth(gssp) {
  return async (context) => {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    }

    return await gssp(context);
  };
}

export function withAuthAdmin(gssp) {
  return async (context) => {
    const session = await getSession(context);

    if (!session || session.user.role !== 'ADMIN') {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return await gssp(context);
  };
}
