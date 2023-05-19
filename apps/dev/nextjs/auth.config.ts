import Auth0 from "@auth/nextjs/providers/auth0"
import Credentials from "@auth/nextjs/providers/credentials"
import Facebook from "@auth/nextjs/providers/facebook"
import GitHub from "@auth/nextjs/providers/github"
import Google from "@auth/nextjs/providers/google"
import Twitter from "@auth/nextjs/providers/twitter"
import { NextAuthConfig } from "@auth/nextjs"

export default {
  debug: true,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      account() {},
    }),
    Auth0,
    Facebook,
    Google,
    Twitter,
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      authorize(c) {
        if (c.password !== "password") return null
        return { id: "test", name: "Test User", email: "test@example.com" }
      },
    }),
  ],
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update" && session) token.name = session
      return token
    },
    authorized({ request, auth }) {
      const url = new URL(request.url)
      if (url.pathname === "/dashboard") return !!auth.user
      return true
    },
  },
} satisfies NextAuthConfig