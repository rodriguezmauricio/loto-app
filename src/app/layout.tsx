"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import SessionWrapper from "components/SessionWrapper";
import Providers from "components/providers/providers";
import SessionSync from "components/SessionSync";

const poppins = Poppins({ weight: ["300", "500", "700"], subsets: ["latin"], display: "swap" });

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html>
            <head />
            <body className={poppins.className}>
                <Providers>
                    <SessionSync />
                    <SessionWrapper>{children}</SessionWrapper>
                </Providers>
            </body>
        </html>
    );
}
