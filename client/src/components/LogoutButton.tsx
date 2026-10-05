import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { clearAuthToken } from "@/apiClient.ts";

export function LogoutButton() {
    const navigate = useNavigate();

    function logout() {
        clearAuthToken();

        toast.success("Logged out.");

        navigate("/login");
    }

    return (
        <button onClick={logout}>
            Log out
        </button>
    );
}