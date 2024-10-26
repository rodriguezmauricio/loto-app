// apiClient.ts

// Utility function to create a user
export const createUser = async (userData: {
    type: "admin" | "vendedor" | "usuario"; // Ensure 'type' is part of userData
    username: string;
    password: string;
    saldo?: number;
    saldoCarteira?: number;
    phone?: string;
    adminId?: string;
    sellerId?: string;
}) => {
    try {
        const baseURL = typeof window === "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : "";

        const response = await fetch(`${baseURL}/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: "Unexpected error",
            }));
            throw new Error(errorData.error || "Failed to create user");
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Example usage for creating a seller
(async () => {
    try {
        const newSeller = await createUser({
            type: "vendedor", // Ensure type is included
            username: "seller123",
            password: "password123",
            saldo: 100,
            saldoCarteira: 50,
            phone: "123-456-7890",
            adminId: "adminId123", // Required for seller
        });
        console.log("Seller created successfully:", newSeller);
    } catch (error) {
        console.error("Failed to create seller:", error);
    }
})();

// Example usage for creating a regular user
(async () => {
    try {
        const newUser = await createUser({
            type: "usuario", // Ensure type is included
            username: "user123",
            password: "password123",
            saldo: 100,
            saldoCarteira: 50,
            phone: "123-456-7890",
            adminId: "adminId123", // Required for user
            sellerId: "sellerId123", // Required for user
        });
        console.log("User created successfully:", newUser);
    } catch (error) {
        console.error("Failed to create user:", error);
    }
})();
