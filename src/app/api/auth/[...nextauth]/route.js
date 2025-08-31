import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../../../lib/mongodb";
import Student from "../../../../../models/Student";
import Teacher from "../../../../../models/Teacher";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { labal: "Password", type: "password" },
      },
      async authorize(Credentials) {
        const { username, password } = Credentials;
        if (!username || !password) {
          throw new Error("Missing credentials");
        }

        try {
          await connectDB();
          if (username.startsWith("T")) {
            const user = await Teacher.findOne({ teacherId: username }).select(
              "+password"
            );
            if (!user) return null;
            const passwordmatch = await bcrypt.compare(password, user.password);
            if (!passwordmatch) return null;
            return {
              id: user._id.toString(),
              username: user.teacherId,
              name: user.name,
              role: user.role,
            };
          } else {
            const user = await Student.findOne({ studentId: username });
            if (!user) return null;
            const passwordmatch = await bcrypt.compare(password, user.password);
            if (!passwordmatch) return null;
            return {
              id: user._id.toString(),
              username: user.studentId,
              name: user.name,
              role: user.role,
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
    maxAge: 60 * 60 * 24,
  },
  jwt: {
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
      }

      if (token.username?.startsWith("T")) {
        token.role = "teacher";
      } else {
        token.role = "student";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.username = token.username;
      session.user.role = token.role;
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
