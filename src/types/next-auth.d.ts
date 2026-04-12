import { DefaultSession } from "next-auth";
import { User as UserType } from "./index";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "CLIENT";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "ADMIN" | "CLIENT";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "ADMIN" | "CLIENT";
  }
}
