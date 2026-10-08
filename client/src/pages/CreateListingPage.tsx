import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { api } from "@/apiClient.ts";
import type {CategoryDto} from "../../Api.ts";
import {NavigationButtons} from "@/components/NavigationButtons.tsx";


export function CreateListingPage() {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [inventory, setInventory] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [categories, setCategories] = useState<CategoryDto[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        api.api.categoryGetCategories()
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error(error);
                toast.error("Could not load categories.");
            });
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (
            !productName.trim() ||
            !productPrice ||
            !inventory ||
            !categoryId
        ) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            await api.createProduct.productCreateProduct({
                productName,
                productPrice: Number(productPrice),
                inventory: Number(inventory),
                categoryId
            });

            toast.success("Listing created!");

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Could not create listing.");
        }
    }

    return (
        <div className="page-container">
            <NavigationButtons />

            <div className="form-page">
                <h1 className="page-title">Create Listing</h1>

                <div className="form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label>
                                Product name
                            </label>

                            <input
                                type="text"
                                value={productName}
                                onChange={event =>
                                    setProductName(event.target.value)
                                }
                            />
                        </div>

                        <div className="form-field">
                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={productPrice}
                                onChange={event =>
                                    setProductPrice(event.target.value)
                                }
                            />
                        </div>

                        <div className="form-field">
                            <label>
                                Category
                            </label>

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
                        </div>

                        <div className="form-field">
                            <label>
                                Inventory
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={inventory}
                                onChange={event =>
                                    setInventory(event.target.value)
                                }
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit">
                                Create Listing
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateListingPage;