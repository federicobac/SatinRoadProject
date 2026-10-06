import type {UserDto} from "../Api.ts";
import {type ReactNode, useContext} from "react";
import {createContext, useState} from "react";
import {clearAuthToken, getAuthToken, setAuthToken} from "@/apiClient.ts";

type AuthContextType = {
    user: UserDto | null;
    isAuthenticated: boolean;
    login: (token: string, user: UserDto) => void;
    logout: () => void;
};

const AuthContext =
    createContext<AuthContextType | undefined>(undefined);

type Props = {
    children: ReactNode;
};

export function AuthProvider({ children }: Props) {
    const [token, setToken] = useState<string | null>(
        getAuthToken()
    );

    const [user, setUser] = useState<UserDto | null>(() => {
        const storedUser = sessionStorage.getItem("user");
        
        return storedUser ? 
            JSON.parse(storedUser) 
            : null;
    });
    
    function login(newToken: string, newUser: UserDto) {
        setAuthToken(newToken);
        
        sessionStorage.setItem(
            "user", 
            JSON.stringify(newUser)
        );
    
        setToken(newToken);
        setUser(newUser);
    }
    
    function logout() {
        clearAuthToken();
        
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value = {{
                user,
                isAuthenticated: token !== null,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider"
        )
    }

    return context;
}

