"use client";
import { useState } from "react";
import DashboardPage from "./(pages)/dashboard/page";
import { ToastContainer, toast } from "react-toastify";
import Login from "./(pages)/login/page";

interface LoginProps {
    setLoggedInAdminId: (id: string) => void;
    setLoggedInSellerId: (id: string) => void;
}

const App: React.FC = () => {
    return (
        <div>
            <Login />
        </div>
    );
};

export default App;
