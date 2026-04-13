import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"
import Google from "next-auth/providers/google"
import Nodemailer from "next-auth/providers/nodemailer"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { Resend } from "resend"
import { db, users, accounts, sessions, verificationTokens } from "@/lib/db"

const OTP_LENGTH = 6
const OTP_TTL_SECONDS = 10 * 60 // 10 minutes

function generateOtp(): string {
  const max = 10 ** OTP_LENGTH
  const n = crypto.getRandomValues(new Uint32Array(1))[0]! % max
  return n.toString().padStart(OTP_LENGTH, "0")
}

// Providers are registered only when their env vars are present.
// This lets each school/user fork the repo, bring their own credentials,
// and only enable the auth methods they want — without hitting your systems.
const providers: Provider[] = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

if (process.env.RESEND_API_KEY) {
  providers.push(
    Nodemailer({
      server: { host: "unused", port: 0, auth: { user: "", pass: "" } },
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
      maxAge: OTP_TTL_SECONDS,
      generateVerificationToken: async () => generateOtp(),
      async sendVerificationRequest({ identifier: email, token, provider }) {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const { error } = await resend.emails.send({
          from: provider.from!,
          to: email,
          subject: `Your sign-in code: ${token}`,
          text: `Your sign-in code is ${token}\n\nThis code expires in ${OTP_TTL_SECONDS / 60} minutes.\nIf you did not request this, ignore this email.`,
          html: `<div style="font-family:system-ui,sans-serif;max-width:420px;margin:auto;padding:24px"><h2 style="margin:0 0 12px">Your sign-in code</h2><p style="color:#555;margin:0 0 16px">Enter this code to finish signing in. It expires in ${OTP_TTL_SECONDS / 60} minutes.</p><div style="font-size:32px;font-weight:600;letter-spacing:6px;padding:16px;background:#f4f4f5;border-radius:8px;text-align:center">${token}</div></div>`,
        })
        if (error) {
          throw new Error(`Resend error: ${error.message}`)
        }
      },
    })
  )
}

const nextAuth = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login",
  },
  providers,
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
