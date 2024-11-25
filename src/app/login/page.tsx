"use client";

import { useState } from "react";
import { useUserStore } from "../../../store/useUserStore"; // Make sure path is correct
import { useRouter } from "next/navigation"; // For Next.js app routing
import { signIn } from "next-auth/react";
import styles from "./login.module.scss"; // Make sure path is correct "./LoginPage.module.css"; // Make sure path is correct "./login.module.scss"; // Make sure path is correct
import SimpleButton from "components/(buttons)/simpleButton/SimpleButton";
import logo from "../../../public/images/lotoplay_light_logo1.svg";
import Image from "next/image";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const setUser = useUserStore((state) => state.setUser); // Zustand store to set user
    const router = useRouter();
    const user = useUserStore((state) => state.user);

    //HANDLERS:
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await signIn("credentials", {
                redirect: false,
                username,
                password,
            });

            console.log("logado");

            if (res?.error) {
                setError(res.error);
            } else {
                window.location.href = "/dashboard";
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An unexpected error occurred.");
        }
    };

    return (
        <div className={styles.main}>
            <div className={styles.logo}>
                <Image src={logo} alt="logo" width={200} height={50} priority />
            </div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Nome de Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <SimpleButton
                    type="submit"
                    isSelected={false}
                    func={() => {}}
                    btnTitle={"Entrar"}
                />
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default LoginPage;
