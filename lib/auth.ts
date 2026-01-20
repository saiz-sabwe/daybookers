import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://127.0.0.1:3000",
    basePath: "/api/auth",
    trustedOrigins: [
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    emailAndPassword: {
        enabled: true,
    },
});