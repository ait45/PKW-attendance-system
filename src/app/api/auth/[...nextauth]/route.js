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
                        const users = await Teacher.findOne({ TeacherId: "T002" }).select("+password");
                        //const t = await Teacher.find({});

                        console.log(users.department);
                        if (!users) return null;
                        console.log(password);
                        console.log(users.password);
                        const passwordmatch = await bcrypt.compare(password, users.password);
                        if (!passwordmatch) return null;
                        return users;
                    } else {
                        const users = await Student.findOne({ StudentId: username });
                        console.log(users);
                        if (!users) return null;
                        console.log(users);
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
