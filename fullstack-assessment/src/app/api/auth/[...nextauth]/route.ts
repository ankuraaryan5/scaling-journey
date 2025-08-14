import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        // Mock users with roles
        const users = [
          { id: 1, username: "admin", password: "admin123", role: "admin" },
          { id: 2, username: "user", password: "user123", role: "user" },
        ];

        const user = users.find(
          u =>
            u.username === credentials?.username &&
            u.password === credentials?.password
        );

        if (user) {
          // Return user with role, cast to satisfy User type
          return { name: user.username, role: user.role } as User & { role: string };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    // Attach role to JWT token
    async jwt({
      token,
      user,
    }: {
      token: JWT & { role?: string };
      user?: User & { role?: string };
    }): Promise<JWT & { role?: string }> {
      if (user?.role) token.role = user.role;
      return token;
    },

    // Attach role to session
    async session({ session, token }: any): Promise<Session> {
      if (token?.role) {
        // Ensure session.user exists
        if (session.user) session.user.role = token.role;
      }
      return session;
    }
  },

  session: { strategy: "jwt" },
};

// NextAuth handler for App Router
const handler = NextAuth(authOptions);

// Export for App Router
export { handler as GET, handler as POST };
