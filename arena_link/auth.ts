import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

/**
 * Full Auth.js config with Node.js-only dependencies (mongoose, bcrypt).
 * Used by server actions, route handlers, and server components.
 * The Edge-compatible subset is in auth.config.ts (used by middleware).
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();

          const user = await User.findOne({
            email: credentials.email,
          }).select("+password");

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || null,
          };
        } catch {
          return null;
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              name: user.name || "Unknown User",
              email: user.email || "",
              image: user.image || "",
              emailVerified: new Date(),
            });
          } else if (!existingUser.image && user.image) {
            existingUser.image = user.image;
            await existingUser.save();
          }
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // The `user` object is only available on initial sign in.
      if (user) {
        try {
          await connectDB();
          if (token.email) {
            const dbUser = await User.findOne({ email: token.email });
            if (dbUser) {
              token.id = dbUser._id.toString();
            } else {
              token.id = user.id;
            }
          } else {
            token.id = user.id;
          }
        } catch {
          token.id = user.id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
