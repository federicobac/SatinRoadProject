import { useNavigate, useParams } from "react-router";
import { type FormEvent, useEffect, useState } from "react";
import type { CategoryDto, ProductDto } from "../../Api.ts";
import toast from "react-hot-toast";
import { api } from "@/apiClient.ts";

export function EditListingPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<ProductDto | null>(null);

    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [inventory, setInventory] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [categories, setCategories] = useState<CategoryDto[]>([]);

    useEffect(() => {
        if (!id) {
            toast.error("Product ID is missing");
            navigate("/dashboard");
            return;
        }

        Promise.all([
            api.mine.productGetMyProducts(),
            api.api.categoryGetCategories()
        ])
            .then(([productsResponse, categoriesResponse]) => {
                const foundProduct = productsResponse.data.find(
                    product => product.productId === id
                );

                if (!foundProduct) {
                    toast.error("Listing not found");
                    navigate("/dashboard");
                    return;
                }

                setProduct(foundProduct);
                setCategories(categoriesResponse.data);

                setProductName(foundProduct.productName ?? "");
                setProductPrice(foundProduct.productPrice?.toString() ?? "");
                setInventory(foundProduct.inventory?.toString() ?? "");
                setCategoryId(foundProduct.categoryId ?? "");
            })
            .catch(error => {
                console.error(error);
                toast.error("Could not load listing");
            });
    }, [id, navigate]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (
            !id ||
            !productName.trim() ||
            !productPrice ||
            !inventory ||
            !categoryId
        ) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            await api.id.productUpdateProduct(id, {
                ProductName: productName,
                ProductPrice: Number(productPrice),
                Inventory: Number(inventory),
                CategoryId: categoryId
            });

            toast.success("Listing updated!");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Could not update listing");
        }
    }

    if (!product) {
        return <p>Loading listing...</p>;
    }

    return (
        <div>
            <h1>Edit Listing</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Product name
                        <input
                            type="text"
                            value={productName}
                            onChange={event =>
                                setProductName(event.target.value)
                            }
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Price
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={productPrice}
                            onChange={event =>
                                setProductPrice(event.target.value)
                            }
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Category
                        <select
                            value={categoryId}
                            onChange={event =>
                                setCategoryId(event.target.value)
                            }
                        >
                            <option value="">
                                Select category
                            </option>

                            {categories.map(category => (
                                <option
                                    key={category.categoryId}
                                    value={category.categoryId}
                                >
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div>
                    <label>
                        Inventory
                        <input
                            type="number"
                            min="0"
                            value={inventory}
                            onChange={event =>
                                setInventory(event.target.value)
                            }
                        />
                    </label>
                </div>

                <button type="submit">
                    Save Changes
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditListingPage;