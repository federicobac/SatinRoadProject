import type { ReactNode } from "react";
import { Navigate } from "react-router";

type Props = {
    children: ReactNode;
};

export function AdminRoute({ children }: Props) {
    const token = sessionStorage.getItem("token");
    const userJson = sessionStorage.getItem("user");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const user = userJson
        ? JSON.parse(userJson)
        : null;

    if (user?.role !== "Admin") {
        return <Navigate to="/products" replace />;
    }

    return children;
}