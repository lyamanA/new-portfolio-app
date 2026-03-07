//api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return session;
    },
  },
  pages: {
    // signIn: '/auth/signin', // кастомная страница входа (опционально)
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };