"use client";
import { Poppins } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import SessionWrapper from "components/SessionWrapper";
import Providers from "components/providers/providers";

const poppins = Poppins({ weight: ["300", "500", "700"], subsets: ["latin"], display: "swap" });

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html>
            <head />
            <body className={poppins.className}>
                <Providers>
                    <SessionWrapper>{children}</SessionWrapper>
                </Providers>
            </body>
        </html>
    );
}
