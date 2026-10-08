import { useEffect, useState } from "react";
import type { ProductDto, OrderDto } from "../../Api.ts";
import { api } from "@/apiClient.ts";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import {NavigationButtons} from "@/components/NavigationButtons.tsx";


export function DashboardPage() {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const navigate = useNavigate();

    function loadProducts() {
        api.mine.productGetMyProducts()
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.log(error);
                toast.error("Could not load your listings");
            });
    }

    function loadOrders() {
        api.api.orderGetMyOrders()
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.log(error);
                toast.error("Could not load your orders");
            });
    }

    useEffect(() => {
        loadProducts();
        loadOrders();
    }, []);

    async function handleDelete(productId: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this listing?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.id.productDeleteProduct(productId);

            toast.success("Listing deleted!");

            loadProducts();
        } catch (error) {
            console.error(error);
            toast.error("Could not delete listing.");
        }
    }

    return (
        <div className="page-container">
            <NavigationButtons />

            <h1 className="page-title">
                Dashboard
            </h1>

            <div className="dashboard-section">
                <h2 className="section-title">
                    My Listings
                </h2>

                <div className="dashboard-grid">
                    {products.map(product => (
                        <div
                            className="dashboard-card"
                            key={product.productId}
                        >
                            <h2>
                                {product.productName}
                            </h2>

                            <p>
                                Price: {product.productPrice}
                            </p>

                            <p>
                                Inventory: {product.inventory}
                            </p>

                            <p>
                                Category:{" "}
                                {product.category?.categoryName}
                            </p>

                            <div className="dashboard-actions">
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/edit-listing/${product.productId}`
                                        )
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(
                                            product.productId
                                        )
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-actions">
                    <button
                        onClick={() =>
                            navigate("/create-listing")
                        }
                    >
                        Create Listing
                    </button>
                </div>
            </div>

            <div className="dashboard-section">
                <h2 className="section-title">
                    My Orders
                </h2>

                {orders.length === 0 ? (
                    <p style={{ textAlign: "center" }}>
                        You haven't placed any orders yet.
                    </p>
                ) : (
                    <div className="dashboard-grid">
                        {orders.map(order => (
                            <div
                                className="dashboard-card"
                                key={
                                    order.orderId ??
                                    `${order.productId}-${order.orderDate}`
                                }
                            >
                                <h2>
                                    {order.productName}
                                </h2>

                                <p>
                                    Seller:{" "}
                                    {order.sellerUsername}
                                </p>

                                <p>
                                    Quantity: {order.quantity}
                                </p>

                                <p>
                                    Price per item:{" "}
                                    {order.productPrice}
                                </p>

                                <p>
                                    Date:{" "}
                                    {order.orderDate
                                        ? new Date(
                                            order.orderDate
                                        ).toLocaleString()
                                        : "Unknown"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;