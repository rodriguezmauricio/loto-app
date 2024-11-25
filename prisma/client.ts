// prisma/client.ts

import { PrismaClient } from "@prisma/client";
import { walletCreationMiddleware } from "./middleware";

const prisma = new PrismaClient();

walletCreationMiddleware(prisma);

export default prisma;
