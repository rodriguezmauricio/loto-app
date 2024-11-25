// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

// Prevent multiple instances of Prisma Client in development
if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
}

export { prisma };
