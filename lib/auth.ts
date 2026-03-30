import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as Role
      }
      return session
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        const email = profile?.email

        if (!email) {
          return false
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email }
        })

        if (existingUser) {
          // User exists, allow sign in
          return true
        }

        // New OAuth user - create them automatically as CONSUMER
        // They can update their profile later
        const name = profile?.name || profile?.given_name || 'User'
        const image = profile?.picture || null

        await prisma.user.create({
          data: {
            email,
            name,
            firstName: profile?.given_name || name.split(' ')[0],
            lastName: profile?.family_name || name.split(' ').slice(1).join(' '),
            image,
            role: 'CONSUMER', // Default to consumer for OAuth
            phone: null, // They can add phone later
          },
        })

        return true
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}

export default NextAuth(authOptions)
