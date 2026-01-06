import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          });

          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return {
              id: user.id,
              name: user.name,
              username: user.username,
              role: user.role
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        // Enregistrer la connexion
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        });

        // Créer une action de connexion
        await prisma.userAction.create({
          data: {
            userId: user.id,
            actionType: 'LOGIN',
            details: 'Connexion utilisateur'
          }
        });

        return true;
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la connexion:', error);
        return true; // Permettre la connexion même si l'enregistrement échoue
      }
    },
    async jwt({ token, user }) {
      // S'assurer que les informations de l'utilisateur sont dans le token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      // S'assurer que les informations du token sont dans la session
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 jours
  },
  pages: {
    signIn: '/auth/signin'
  },
  debug: process.env.NODE_ENV === 'development'
};

export default NextAuth(authOptions);
