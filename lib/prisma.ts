// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Allow global var in dev to avoid hot-reload creating many clients
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query"], // optional: useful while developing
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
