import {createBrowserRouter, type RouteObject, RouterProvider} from "react-router";
import App from "@/App.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import CreateUserPage from "@/pages/CreateUserPage.tsx";
import ProductPage from "@/pages/ProductPage.tsx";
import CategoryPage from "@/pages/CategoryPage.tsx";
import {ProtectedRoute} from "@/routing/ProtectedRoute.tsx";
import {AdminRoute} from "@/routing/AdminRoute.tsx";
import DashboardPage from "@/pages/DashboardPage.tsx";
import CreateListingPage from "@/pages/CreateListingPage.tsx";

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