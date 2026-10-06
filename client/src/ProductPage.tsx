import "./index.css";
import {type ProductDto} from "../Api.ts";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {LogoutButton} from "@/components/LogoutButton.tsx";
import {api} from "@/apiClient.ts";


export function ProductPage() {
    const [products, setProducts] = useState<ProductDto[]>([]);

    useEffect(() => {
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
    }, []);

    
    return (
        <div className="app">
            <h1>Products</h1>

            {
                products.map(product => (
                    <div key={product.productId}>
                        <h2>{product.productName}</h2>

                        <p>Price: {product.productPrice}</p>
                        <p>Inventory: {product.inventory}</p>
                        <p>
                            Category: {product.category?.categoryName}
                        </p>
                        
                    </div>
                ))
            }

            <LogoutButton />
        </div>
    );

}

export default ProductPage;