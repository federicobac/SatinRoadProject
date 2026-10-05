import "./index.css";
import {type ProductDto} from "../Api.ts";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {LogoutButton} from "@/components/LogoutButton.tsx";
import {api} from "@/apiClient.ts";


export function ProductPage() {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [newProductName, setNewProductName] = useState("")

    useEffect(() => {
        api.getProducts.productGetProducts({page: 1, resultsPerPage: 1})
            .then(r => {
                const data = r.data;
                setProducts(data);
                const p = data[0]!;
            })
    }, []);

    function createProduct() {
        api.createProduct.productCreateProduct({
            ProductName: newProductName,
            CategoryId: "1",
            ProductPrice: 100
        }).then(r => {
            const duplicate = [...products, r.data];
            setProducts(duplicate);
        }).catch(e => {
            toast(e.error.title);
        })
    }

    return (
        <div className="app">
            {
                products.map(p => {
                    return <div key={p.productId}>{p.productName}</div>
                })
            }

            <input value={newProductName} onChange={e => setNewProductName(e.target.value)} />
            <button onClick={createProduct}>Create product</button>

            <LogoutButton />
        </div>
    );
}

export default ProductPage;