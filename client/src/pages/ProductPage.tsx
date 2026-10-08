import "../index.css";
import {type ProductDto} from "../../Api.ts";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {api} from "@/apiClient.ts";
import {NavigationButtons} from "@/components/NavigationButtons.tsx";


export function ProductPage() {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [quantities, setQuantities] = useState<Record<string, number>>({})

    function loadProducts() {
        api.getProducts.productGetProducts({
            page: 1,
            resultsPerPage: 20
        })
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error(error);
                toast.error("Could not load products");
            })
    }

    useEffect(() => {
        loadProducts();
    }, []);

    async function handleBuy(product: ProductDto) {
        if (!product.productId) {
            toast.error("Product not found!");
            return;
        }

        const quantity = quantities[product.productId] ?? 1;

        try {
            await api.api.orderCreateOrder({
                productId: product.productId,
                quantity: quantity
            })

            toast.success("Purchase successful!");
            loadProducts();

        } catch (error: any) {

            console.error(error);
            toast.error(
                error?.error?.title ?? "Could not complete purchase",
            );
        }
    }

    function handleQuantityChange(
        productId: string,
        quantity: number,
    ) {
        setQuantities(previous => ({
            ...previous,
            [productId]: quantity
        }));
    }


    return (
        <div className="page-container">
            <NavigationButtons />

            <h1 className="page-title">
                Products
            </h1>

            <div className="products-grid">
                {products.map(product => (
                    <div
                        className="product-card"
                        key={product.productId}
                    >
                        <div>
                            <h2>
                                {product.productName}
                            </h2>

                            <p>
                                Price:{" "}
                                <strong>
                                    {product.productPrice}
                                </strong>
                            </p>

                            <p>
                                Seller:{" "}
                                <strong>
                                    {product.sellerUsername}
                                </strong>
                            </p>

                            <p>
                                Inventory:{" "}
                                <strong>
                                    {product.inventory}
                                </strong>
                            </p>

                            <p>
                                Category:{" "}
                                <strong>
                                    {product.category?.categoryName}
                                </strong>
                            </p>
                        </div>

                        <div className="product-purchase">
                            <input
                                type="number"
                                min="1"
                                max={product.inventory}
                                value={
                                    quantities[
                                    product.productId ?? ""
                                        ] ?? 1
                                }
                                disabled={!product.inventory}
                                onChange={event =>
                                    handleQuantityChange(
                                        product.productId ?? "",
                                        Number(event.target.value)
                                    )
                                }
                            />

                            <button
                                disabled={!product.inventory}
                                onClick={() =>
                                    handleBuy(product)
                                }
                            >
                                Buy
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductPage;