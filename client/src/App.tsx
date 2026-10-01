import { APITester } from "./APITester";
import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";
import {Api, type ProductDto} from "../Api.ts";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

const MyApi = new Api();

export function App() {
  
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [newProductName, setNewProductName] = useState()
    
    useEffect(() => {
        MyApi.getProducts.productGetProducts({page: 1, resultsPerPage: 1})
            .then(r => {
                const data = r.data;
                setProducts(data);
                const p = data[0]!;
        })
    }, []);

    function createProduct() {
        MyApi.createProduct.productCreateProduct({
            ProductName: newProductName,
            CategoryId: "1",
            ProductPrice: "100"
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
                return <div key {p.productId}>{p.productName}</div> 
            })
        }
        
        <input value={newProductName} onChange={e => setNewProductName(e.target.value)} />
        <button onClick={createProduct}>Create product</button>
    </div>
  );
}

export default App;
