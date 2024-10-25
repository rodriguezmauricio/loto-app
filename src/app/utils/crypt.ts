import bcrypt from "bcrypt";

const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10; // Higher numbers increase security but take more time
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export { hashPassword, verifyPassword };
