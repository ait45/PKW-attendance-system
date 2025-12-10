import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBConnection } from "./config.mongoDB";
import Student from "../models/Mongo.model.Student";
import Teacher from "../models/Mongo.model.Teacher";
import bcrypt from "bcrypt";

export const handlers = NextAuth({
  // function Process Username and Password
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials;
        if (!username || !password) {
          throw new Error("Missing credentials");
        }

        try {
          await MongoDBConnection();
          if (username.startsWith("T")) {
            const user = await Teacher.findOne({ teacherId: username });

            if (!user) return null;
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) return null;
            //ratelimit.delete(ip);
            //console.log(`[${ip}] login success -> reset count`);
            console.log(user);
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
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) return null;
            //ratelimit.delete(ip);
            //console.log(`[${ip}] login success -> reset count`);
            console.log(user);
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
    secret: process.env.NEXTAUTH_SECRET,
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
