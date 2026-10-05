import type {ReactNode} from "react";
import {getAuthToken} from "@/apiClient.ts";
import {Navigate} from "react-router";

type Props = {
    children: ReactNode;
};

export function ProtectedRoute({ children }: Props) {
    const token = getAuthToken();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}