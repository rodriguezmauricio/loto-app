// src/app/(pages)/login/page.tsx
"use client"; // This is important for client-side components
import React, { useState } from "react";

// Define the props interface
interface LoginProps {
    setLoggedInAdminId: (id: string) => void;
    setLoggedInSellerId: (id: string) => void;
}

// Login Component
const Login: React.FC<LoginProps> = ({ setLoggedInAdminId, setLoggedInSellerId }) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Set the logged-in ID based on user type
            if (data.userType === "admin") {
                setLoggedInAdminId(data.id);
            } else if (data.userType === "vendedor") {
                setLoggedInSellerId(data.id);
            }
        } else {
            console.error("Login failed:", data.message);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
};

// Export the component as default
export default Login;
