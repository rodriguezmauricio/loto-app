// src/components/Avatar.tsx

import React from "react";
import styles from "./Avatar.module.scss"; // We'll create this CSS module next

interface AvatarProps {
    username: string;
    size?: number; // Optional prop to define avatar size
}

const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color =
        "#" +
        ((hash >> 24) & 0xff).toString(16).padStart(2, "0") +
        ((hash >> 16) & 0xff).toString(16).padStart(2, "0") +
        ((hash >> 8) & 0xff).toString(16).padStart(2, "0");
    return color;
};

const Avatar: React.FC<AvatarProps> = ({ username, size = 50 }) => {
    const initial = username.charAt(0).toUpperCase();
    const backgroundColor = stringToColor(username);

    return (
        <div
            className={styles.avatar}
            style={{
                backgroundColor,
                width: size,
                height: size,
                lineHeight: `${size}px`,
                fontSize: size / 2,
            }}
            aria-label={`Avatar for ${username}`}
            title={username}
        >
            {initial}
        </div>
    );
};

export default Avatar;
