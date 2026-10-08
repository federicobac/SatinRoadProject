/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {Toaster} from "react-hot-toast";
import {Routing} from "@/routing/Routing.tsx";
import {AuthProvider} from "@/AuthContext.tsx";

const elem = document.getElementById("root")!;
const app = (
    <StrictMode>
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: "#191414",
                    color: "#ffffff",
                    border: "1px solid #282828",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "0.95rem",
                },
                success: {
                    style: {
                        background: "#191414",
                        color: "#ffffff",
                        border: "1px solid #1DB954",
                    },
                    iconTheme: {
                        primary: "#1DB954",
                        secondary: "#121212",
                    },
                },
                error: {
                    style: {
                        background: "#191414",
                        color: "#ffffff",
                        border: "1px solid #E22134",
                    },
                    iconTheme: {
                        primary: "#E22134",
                        secondary: "#121212",
                    },
                },
            }}
        />
        <AuthProvider>
            <Routing />
        </AuthProvider>

    </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(app);
