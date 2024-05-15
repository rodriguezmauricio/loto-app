import React from "react";
import Image from "next/image";
import logo from "../../../../public/images/lotoplay_light_logo.svg";
import styles from "./login.module.css";

const LoginPage = () => {
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("test");

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
          type="email"
          name="email"
          id="email"
          placeholder="email..."
        />
        <label>Password</label>
        <input
          className={styles.input}
          type="password"
          name="senha"
          id="senha"
          placeholder="senha..."
        />
        <button className={styles.button} type="submit">
          Login
        </button>
      </form>
    </main>
  );
};

export default LoginPage;
