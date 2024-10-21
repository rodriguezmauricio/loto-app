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
    const [loggedInAdminId, setLoggedInAdminId] = useState<string>("");
    const [loggedInSellerId, setLoggedInSellerId] = useState<string>("");

    return (
        <div>
            {!loggedInAdminId && !loggedInSellerId ? (
                <Login
                    setLoggedInAdminId={setLoggedInAdminId}
                    setLoggedInSellerId={setLoggedInSellerId}
                />
            ) : (
                <DashboardPage />
            )}
        </div>
    );
};

export default App;
