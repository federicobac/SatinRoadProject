import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/AuthContext.tsx";
import { LogoutButton } from "@/components/LogoutButton.tsx";

export function NavigationButtons() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    const isCurrentPage = (path: string) =>
        location.pathname === path;

    if (!isAuthenticated) {
        return (
            <nav className="navigation-buttons">
                {!isCurrentPage("/") && (
                    <button onClick={() => navigate("/")}>
                        Home
                    </button>
                )}

                {!isCurrentPage("/login") && (
                    <button onClick={() => navigate("/login")}>
                        Log in
                    </button>
                )}

                {!isCurrentPage("/create-user") && (
                    <button onClick={() => navigate("/create-user")}>
                        Create user
                    </button>
                )}
            </nav>
        );
    }

    return (
        <nav className="navigation-buttons">
            {!isCurrentPage("/") && (
                <button onClick={() => navigate("/")}>
                    Home
                </button>
            )}

            {!isCurrentPage("/products") && (
                <button onClick={() => navigate("/products")}>
                    Products
                </button>
            )}

            {!isCurrentPage("/dashboard") && (
                <button onClick={() => navigate("/dashboard")}>
                    Dashboard
                </button>
            )}

            {!isCurrentPage("/create-listing") && (
                <button onClick={() => navigate("/create-listing")}>
                    Create Listing
                </button>
            )}

            {user?.role === "Admin" &&
                !isCurrentPage("/admin/categories") && (
                    <button
                        onClick={() =>
                            navigate("/admin/categories")
                        }
                    >
                        Categories
                    </button>
                )}

            <LogoutButton />
        </nav>
    );
}