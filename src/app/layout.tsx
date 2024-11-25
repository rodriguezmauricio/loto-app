"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import SessionWrapper from "components/SessionWrapper";

const poppins = Poppins({ weight: ["300", "500", "700"], subsets: ["latin"], display: "swap" });

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html>
            <body className={poppins.className}>
                <SessionWrapper>{children}</SessionWrapper>
            </body>
        </html>
    );
}
