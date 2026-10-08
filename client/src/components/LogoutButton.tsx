import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {useAuth} from "@/AuthContext.tsx";

export function LogoutButton() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();

        toast.success("Logged out.");

        navigate("/");
    }

    return (
        <button onClick={handleLogout}>
            Log out
        </button>
    );
}