"use client";

import { FormEvent, ReactElement, ChangeEvent, useState } from "react";
import Image from "next/image";
import logo from "../../../../public/images/lotoplay_light_logo.svg";
import styles from "./login.module.css";

const LoginPage = () => {
  const [loginData, setloginData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleUserData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setloginData((prevState) => ({ ...prevState, [name]: value }));
    console.log(loginData.username);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/src/app/lib/auth.ts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        // Handle successful login (e.g., redirect to another page or show success message)
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Login failed");
        console.error("Login error:", errorData);
        // Handle login error (e.g., show error message to the user)
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Unexpected error:", error);
      // Handle unexpected error
    }

    /*
    write the code to check if the data inserted in the fields match the ones in the database.
    
    */
  };

  return (
    <main className={styles.main}>
      <Image src={logo} alt="logo" width={130} height={50} />
      <form className={styles.form} onSubmit={(e) => handleLogin(e)}>
        <h1>Login</h1>
        <label>E-mail</label>
        <input
          className={styles.input}
          type="text"
          name="username"
          id="username"
          placeholder="username..."
          value={loginData.username}
          onChange={handleUserData}
        />
        <label>Password</label>
        <input
          className={styles.input}
          type="password"
          name="senha"
          id="senha"
          placeholder="senha..."
          value={loginData.password}
          onChange={handleUserData}
        />
        <button className={styles.button} type="submit">
          Login
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
