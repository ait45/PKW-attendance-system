import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";
import bcrypt from "bcrypt";
import Swal from "sweetalert2";

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
                    console.log(username);
                    console.log(password);
                    const users = await User.findOne({ username: username });
                    if (!users) return null;

                    const passwordmatch = await bcrypt.compare(password, users.password);
                    if (!passwordmatch) return null;

                    return users;

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
