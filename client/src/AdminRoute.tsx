import type { ReactNode } from "react";
import { Navigate } from "react-router";
import {useAuth} from "@/AuthContext.tsx";

type Props = {
    children: ReactNode;
};

export function AdminRoute({ children }: Props) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "Admin") {
        return <Navigate to="/products" replace />;
    }

    return children;
}