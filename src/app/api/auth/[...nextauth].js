import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import clientPromise from "../../../../lib/mongodb";

export default NextAuth({
   session: { strategy: "jwt" },
   providers: [
    Credentials({
        name: "Credentials",
        credentials: {
            username: { label: "Username", type: "text"},
            password: { label: "Password", type: "password"},
        },
        authorize: async (credentials) => {
            const client = await clientPromise;
            const db = client.db();
            const user = await db.collection("users").findOne({ username: credentials.username });
            if (!user) return null;

            const ok = await bcrypt.compare(credentials.password, user.password);
            if (!ok) return null;

            return {
                id: user._id.toString(),
                name: user.name || user.username,
                role: user.role || "student",
                classRoom: user.classRoom || null,
            };
        },
    }),
   ],
   callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token.uid = user.id;
            token.role = user.role;
            token.username = user.username;
            token.classRoom = user.classRoom || null;
        }
        return token;
    },
    async session({ session, token }) {
        if (token) {
            session.user.id = token.uid;
            session.user.role = token.role;
            session.user.username = token.username;
            session.user.classRoom = token.classRoom;
        }
        return session;
    },
   },
   pages: {
    signIn: "/login",
   }
});