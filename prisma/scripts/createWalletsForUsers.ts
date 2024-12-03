// prisma/scripts/createWalletsForUsers.ts

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createWalletsForUsers() {
    try {
        await prisma.$connect();
        console.log("Database connection successful.");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }

    try {
        // Fetch users without wallets
        const usersWithoutWallets = await prisma.user.findMany({
            where: { wallet: null },
            select: { id: true, username: true },
        });

        if (usersWithoutWallets.length === 0) {
            console.log("All users already have wallets.");
            return;
        }

        console.log(`Found ${usersWithoutWallets.length} users without wallets.`);

        for (const user of usersWithoutWallets) {
            try {
                const wallet = await prisma.wallet.create({
                    data: {
                        userId: user.id,
                        balance: 0, // Initialize with a balance of 0
                    },
                });
                console.log(
                    `Created Wallet ID: ${wallet.id} for User ID: ${user.id} (${user.username})`
                );
            } catch (error) {
                console.error(`Error creating wallet for user: ${user.username}`, error);
            }
        }

        console.log("Wallet creation process completed.");
    } catch (error) {
        console.error("Error fetching users without wallets:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createWalletsForUsers();
