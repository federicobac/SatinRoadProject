import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {api} from "@/apiClient.ts";
import { useAuth } from "@/AuthContext.tsx";


export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const {login} = useAuth();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {

        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            toast.error("Username and password are required.");
            return;
        }

        try {
            const response = await api.api.userLogin({
                username: username.trim(),
                password
            });

            login(
                response.data.token!,
                response.data.user!
            );

            console.log("Logged in user:", response.data);

            toast.success(`Welcome, ${response.data.user?.username}!`);

            navigate("/products");
        } catch (error) {
            console.error(error);
            toast.error("Invalid username or password.");
        }
    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Username
                        <input
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </label>
                </div>

                <button type="submit">
                    Log in
                </button>
            </form>
        </div>
    );
}

export default LoginPage;