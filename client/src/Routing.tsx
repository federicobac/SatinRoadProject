import {createBrowserRouter, type RouteObject, RouterProvider} from "react-router";
import App from "@/App.tsx";
import LoginPage from "@/LoginPage.tsx";
import CreateUserPage from "@/CreateUserPage.tsx";
import ProductPage from "@/ProductPage.tsx";
import CategoryPage from "@/CategoryPage.tsx";
import {ProtectedRoute} from "@/ProtectedRoute.tsx";
import {AdminRoute} from "@/AdminRoute.tsx";
import DashboardPage from "@/DashboardPage.tsx";
import CreateListingPage from "@/CreateListingPage.tsx";

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
        path: "/admin/categories",
        element: (
            <AdminRoute>
                <CategoryPage />
            </AdminRoute>
        )
    },
    {
        path: "/products",
        element: (
            <ProtectedRoute>
                <ProductPage />
            </ProtectedRoute>
        )
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <DashboardPage />
            </ProtectedRoute>
        )
    },
    {
        path: "/create-listing",
        element: (
            <ProtectedRoute>
                <CreateListingPage />
            </ProtectedRoute>
        )
    }
    
];

const router = createBrowserRouter(routes);

export function Routing() {
    return <RouterProvider router={router} />;
}