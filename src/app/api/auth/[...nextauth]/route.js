import NextAuthPkg from "next-auth/next";
import CredentialsPkg from "next-auth/providers/credentials";
import { connectDB } from "../../../../../lib/mongodb";
import Student from "../../../../../models/Student";
import Teacher from "../../../../../models/Teacher";
import bcrypt from "bcrypt";

const NextAuth = NextAuthPkg.default || NextAuthPkg;
const Credentials = CredentialsPkg.default || CredentialsPkg;

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { labal: "Password", type: "password" },
      },
      async authorize(credentials) {
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
        token.id = user.id,
        token.username = user.username;
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
      session.id = token.id,
      session.user.username = token.username;
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
