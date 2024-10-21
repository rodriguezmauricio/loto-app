"use client";
// components/Login.tsx
import React, { useState } from "react";

interface LoginProps {
    setLoggedInAdminId: (id: string) => void;
    setLoggedInSellerId: (id: string) => void;
}

const Login: React.FC<LoginProps> = ({ setLoggedInAdminId, setLoggedInSellerId }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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

export default Login;
