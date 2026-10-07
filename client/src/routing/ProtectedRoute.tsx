import type {ReactNode} from "react";
import {getAuthToken} from "@/apiClient.ts";
import {Navigate} from "react-router";
import {useAuth} from "@/AuthContext.tsx";

type Props = {
    children: ReactNode;
};

export function ProtectedRoute({ children }: Props) {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}