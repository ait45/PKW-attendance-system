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
                password: { labal: "Password", type: "password" }
            },
            async authorize(Credentials) {
                const { username, password } = Credentials;


                try {
                    await connectDB();
                    if (username.startsWith("T")) {
                        const users = await Teacher.findOne({ teacherId: username }).select("+password");
                        if (!users) return null;
                        const passwordmatch = await bcrypt.compare(password, users.password);
                        if (!passwordmatch) return null;
                        return users;
                    } else {
                        const users = await Student.findOne({ studentId: username });
                        if (!users) return null;
                        const passwordmatch = await bcrypt.compare(password, users.password);
                        if (!passwordmatch) return null;
                        return users;

                    }



                } catch (error) {
                    console.error(error);
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login"
    }
});
export { handler as GET, handler as POST };
