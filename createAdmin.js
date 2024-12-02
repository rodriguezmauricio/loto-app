// createAdmin.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const adminUsername = "Angel01";
    const adminPassword = "catarina22"; // Plain text password
    const hashedPassword = await bcrypt.hash(adminPassword, 10); // Hashing with salt rounds = 10

    // Check if admin already exists
    let adminUser = await prisma.user.findUnique({
        where: { username: adminUsername },
    });

    if (adminUser) {
        // Update the existing admin's password_hash
        adminUser = await prisma.user.update({
            where: { username: adminUsername },
            data: {
                password_hash: hashedPassword,
                role: "admin", // Ensure the role is set to admin
                // Update other fields if necessary
            },
        });
        console.log(`Admin user '${adminUsername}' updated with new hashed password.`);
    } else {
        // Create a new admin user
        adminUser = await prisma.user.create({
            data: {
                username: adminUsername,
                password_hash: hashedPassword,
                role: "admin",
                bancaName: "telelotto",
                name: "Angela",
                // Populate other required fields as necessary
            },
        });
        console.log(`Admin user '${adminUsername}' created successfully.`);
    }

    // **Create a wallet for the admin user**
    // Check if the wallet already exists
    const existingWallet = await prisma.wallet.findUnique({
        where: { userId: adminUser.id },
    });

    if (existingWallet) {
        console.log(`Wallet already exists for admin user '${adminUsername}'.`);
    } else {
        // Create a new wallet
        const newWallet = await prisma.wallet.create({
            data: {
                userId: adminUser.id,
                balance: 0, // Initial balance; adjust if necessary
                // Add other fields if required
            },
        });
        console.log(`Wallet created for admin user '${adminUsername}'.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
