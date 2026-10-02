import {createBrowserRouter, type RouteObject, RouterProvider} from "react-router";
import App from "@/App.tsx";
import LoginPage from "@/LoginPage.tsx";
import CreateUserPage from "@/CreateUserPage.tsx";
import ProductPage from "@/ProductPage.tsx";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/create-user",
        element: <CreateUserPage />
    },
    {
        path: "/products",
        element: <ProductPage />
    }
];

const router = createBrowserRouter(routes);

export function Routing() {
    return <RouterProvider router={router} />;
}