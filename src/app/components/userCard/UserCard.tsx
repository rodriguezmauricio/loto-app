import React from "react";
import styles from "./userCard.module.css";
import { FaUser } from "react-icons/fa6";

interface IUserCard {
  username: string;
  phone: string;
}

const UserCard = ({ username, phone }: IUserCard) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <FaUser size={30} />
      </div>
      <div className={styles.divider}></div>
      <div className={styles.infos}>
        <p>{username}</p>
        <p>{phone}</p>
      </div>
    </div>
  );
};

export default UserCard;
