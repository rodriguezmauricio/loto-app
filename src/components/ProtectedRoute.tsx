// // src/components/ProtectedRoute/ProtectedRoute.tsx
//TODO: CHANGE CODES BEFORE SENDING TO PRODUCTION!
//TODO: CHANGE CODES BEFORE SENDING TO PRODUCTION!
//TODO: CHANGE CODES BEFORE SENDING TO PRODUCTION!
// "use client";

// import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Role } from "../types/roles";
// import { ROUTES } from "@routes/routes";
// import styles from "./ProtectedRoute.module.scss";

// interface ProtectedRouteProps {
//     children: React.ReactNode;
//     requiredRole: Role;
//     currentUserRole: Role;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//     children,
//     requiredRole,
//     currentUserRole,
// }) => {
//     const router = useRouter();

//     useEffect(() => {
//         if (currentUserRole !== requiredRole) {
//             // Redirect to Home or Unauthorized page
//             router.push(ROUTES.HOME);
//         }
//     }, [currentUserRole, requiredRole, router]);

//     if (currentUserRole !== requiredRole) {
//         return <div className={styles.spinner}></div>; // Display spinner while redirecting
//     }

//     return <>{children}</>;
// };

// export default ProtectedRoute;

// src/components/ProtectedRoute/ProtectedRoute.tsx

// src/components/ProtectedRoute/ProtectedRoute.tsx

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "../types/roles";
import { ROUTES } from "../routes/routes";

const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole: Role;
    currentUserRole?: string | Role | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    currentUserRole,
}) => {
    const router = useRouter();

    useEffect(() => {
        // if (disableAuth) {
        //     return;
        // }

        if (!currentUserRole || currentUserRole !== requiredRole) {
            router.push(ROUTES.LOGIN);
        }
    }, [currentUserRole, requiredRole, router]);

    // if (!disableAuth && (!currentUserRole || currentUserRole !== requiredRole)) {
    //     return null;
    // }

    return <>{children}</>;
};

export default ProtectedRoute;
