import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {api} from "@/apiClient.ts";
import {NavigationButtons} from "@/components/NavigationButtons.tsx";



export function CreateUserPage() {
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
            await api.api.userCreateUser({
                username,
                password
            });

            toast.success("User created successfully!");

            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error("Could not create user.");
        }
    }

    return (
        <div>

            <NavigationButtons />

            <h1>Create User</h1>

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
                    Create user
                </button>
            </form>
        </div>
    );
}

export default CreateUserPage;