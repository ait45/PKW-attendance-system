import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: string;
    isAdmin: boolean;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
    id: string;
    username: string;
    role: string;
    isAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      username: string;
      role: string;
      isAdmin: boolean;
    };
    id: string;
    username: string;
    role: string;
    isAdmin: boolean;
  }
}
