import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {api, setAuthToken} from "@/apiClient.ts";


export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            toast.error("Username and password are required.");
            return;
        }

        try {
            const response = await api.api.userLogin({
                username: username,
                password
            });

            setAuthToken(response.data.token);

            sessionStorage.setItem(
                "user",
                JSON.stringify(response.data.token)
            );

            console.log("Logged in user:", response.data);

            toast.success(`Welcome, ${response.data?.username}!`);

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