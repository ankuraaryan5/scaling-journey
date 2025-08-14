// src/lib/auth.ts
import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
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
          return { name: user.username, role: user.role } as User & { role: string };
        }

        return null;
      },
    }),
  ],
  callbacks: {
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
    async session({ session, token }: any): Promise<Session> {
      if (token?.role) {
        if (session.user) session.user.role = token.role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};
