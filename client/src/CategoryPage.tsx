import {useEffect, useState} from "react";
import {Api, type CategoryDto} from "../Api.ts";
import toast from "react-hot-toast";
import {LogoutButton} from "@/components/LogoutButton.tsx";

const api = new Api();

export function CategoryPage() {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [categoryName, setCategoryName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

    async function loadCategories() {
        try {
            const response = await api.api.categoryGetCategories();

            setCategories(response.data);
        } catch (error) {
            console.error(error);
            toast("Could not load categories");
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    async function handleCreate() {
        if (!categoryName.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            await api.api.categoryCreateCategory({
                categoryName,
            })

            toast.success("Category created");
            setCategoryName("");

            await loadCategories();
        } catch (error) {
            console.error(error);
            toast.error("Could not create category");
        }
    }

    function startEditing(categoryId: string, name: string) {
        setEditingId(categoryId);
        setEditingName(name);
    }

    function cancelEditing() {
        setEditingId(null);
        setEditingName("");
    }

    async function handleUpdate() {
        if (!editingId) {
            return;
        }

        if (!editingName.trim()) {
            toast.error("Category name is required");
            return;
        }

        try {
            await api.api.categoryUpdateCategory(
                editingId,
                {
                    categoryName: editingName
                }
            );

            toast.success("Category updated");

            cancelEditing();
            await loadCategories();

        } catch (error) {
            console.error(error);
            toast.error("Could not update category");
        }
    }

    async function handleDelete(categoryId: string) {
        try {
            await api.api.categoryDeleteCategory(categoryId);
            toast.success("Category deleted");
            await loadCategories();
        } catch (error) {
            console.error(error);
            toast.error("Could not delete category");
        }
    }

    return (
        <div>
            <h1>Categories</h1>

            <div>
                <input
                    type="text"
                    placeholder="Category name"
                    value={categoryName}
                    onChange={(event) =>
                        setCategoryName(event.target.value)}
                />

                <button onClick={handleCreate}>
                    Create category
                </button>
            </div>

            <hr />

            {categories.map((category) => {
                if (!category.categoryId) {
                    return null;
                }

                const isEditing = editingId === category.categoryId;

                return (
                    <div key={category.categoryId}>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(event) =>
                                        setEditingName(event.target.value)}
                                />

                                <button onClick={handleUpdate}>
                                    Save
                                </button>

                                <button onClick={cancelEditing}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <span>
                                    {category.categoryName}
                                </span>

                                <button onClick={() => startEditing(
                                        category.categoryId!,
                                        category.categoryName ?? "")}>
                                    Edit
                                </button>

                                <button onClick={() => handleDelete(category.categoryId!)}>
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                );
            })}
            <LogoutButton />
        </div>
    );
}

export default CategoryPage;