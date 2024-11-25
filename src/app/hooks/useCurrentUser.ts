// hooks/useCurrentUser.ts

"use client";

import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "your_jwt_secret_key";

export function useCurrentUser() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (token) {
            try {
                const decoded = jwt.decode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Invalid token");
            }
        }
    }, []);

    return user;
}
