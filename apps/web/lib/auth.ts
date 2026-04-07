import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const nextAuth = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      // TODO: Replace this with your actual authentication logic.
      // Connect to your auth backend, database, or identity provider.
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) {
          return null
        }

        // Placeholder: accept any non-empty credentials for development.
        // In production, validate against your auth backend.
        return {
          id: "1",
          email,
          name: email.split("@")[0],
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})

export const handlers: typeof nextAuth.handlers = nextAuth.handlers
export const signIn: typeof nextAuth.signIn = nextAuth.signIn
export const signOut: typeof nextAuth.signOut = nextAuth.signOut
export const auth: typeof nextAuth.auth = nextAuth.auth
