// prisma/middleware.ts

import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";

export function walletCreationMiddleware(prisma: PrismaClient) {
    prisma.$use(async (params: any, next: any) => {
        if (params.model === "User" && params.action === "create") {
            const result = await next(params);

            // Create a Wallet for the newly created User
            // await prisma.wallet.create({
            //     data: {
            //         userId: result.id,
            //         balance: 0, // Initial balance
            //     },
            // });

            return result;
        }

        return next(params);
    });
}
