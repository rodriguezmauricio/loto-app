import bcrypt from "bcrypt";

async function hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

const passwordHash = await hashPassword("admin_password");
