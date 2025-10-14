import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../../../lib/mongodb";
import Student from "../../../../../models/Student";
import Teacher from "../../../../../models/Teacher";
import bcrypt from "bcrypt";
import { LRUCache } from "lru-cache";
import { NextResponse } from "next/server";

const ratelimit = new LRUCache({
  max: 500,
  ttl: 1000 * 60,
});

function checkRatelimit(ip) {
  const count = ratelimit.get(ip) || 0;
  if (count >= 5) return false;
  ratelimit.set(ip, count + 1);
  return true;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const ip =
          req.headers?.get?.("x-forwarded-for")?.split(",")[0] ||
          req.headers?.get?.("x-real-ip") ||
          "127.0.0.1";

        console.log("Client IP:", ip);
        if (!checkRatelimit(ip))
          return NextResponse.json(
            { error: "Too many requests" },
            { status: 429 }
          );
        console.log(req.headers);
        const { username, password } = credentials;
        if (!username || !password) {
          throw new Error("Missing credentials");
        }

        try {
          await connectDB();
          if (username.startsWith("T")) {
            const user = await Teacher.findOne({ teacherId: username });

            if (!user) return null;
            const passwordmatch = await bcrypt.compare(password, user.password);
            if (!passwordmatch) return null;
            //ratelimit.delete(ip);
            //console.log(`[${ip}] login success -> reset count`);
            return {
              id: user._id.toString(),
              username: user.teacherId,
              name: user.name,
              role: user.role,
              isAdmin: user.isAdmin,
            };
          } else {
            const user = await Student.findOne({ studentId: username });
            if (!user) return null;
            const passwordmatch = await bcrypt.compare(password, user.password);
            if (!passwordmatch) return null;
            //ratelimit.delete(ip);
            //console.log(`[${ip}] login success -> reset count`);
            return {
              id: user._id.toString(),
              username: user.studentId,
              name: user.name,
              role: user.role,
              isAdmin: user.isAdmin,
            };
          }
        } catch (error) {
          console.error(error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 30,
  },
  jwt: {
    maxAge: 60 * 30,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token.id = user.id), (token.username = user.username);
        token.name = user.name;
        token.isAdmin = user.isAdmin;
      }

      if (token.username?.startsWith("T")) {
        token.role = "teacher";
      } else {
        token.role = "student";
      }
      return token;
    },
    async session({ session, token }) {
      (session.id = token.id), (session.user.username = token.username);
      session.user.name = token.name;
      session.user.role = token.role;
      session.user.isAdmin = token.isAdmin;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // ป้องกันการ reload หลายหน้า
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;

      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
