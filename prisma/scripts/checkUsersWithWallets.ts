// prisma/scripts/checkUsersWithWallets.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUsersWithoutWallets() {
    const usersWithoutWallets = await prisma.user.findMany({
        where: { wallet: null },
        select: { id: true, username: true },
    });

    if (usersWithoutWallets.length === 0) {
        console.log("All users have associated wallets.");
    } else {
        console.log(`Found ${usersWithoutWallets.length} users without wallets:`);
        usersWithoutWallets.forEach((user) => {
            console.log(`- User ID: ${user.id}, Username: ${user.username}`);
        });
    }
}

checkUsersWithoutWallets()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
