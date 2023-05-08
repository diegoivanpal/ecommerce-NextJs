import ProductForm from "@/components/ProductForm";
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function EditProductPage() {
    const [productInfo, setProducyInfo] = useState(null)
    const router= useRouter()
    const {id} = router.query
    useEffect(() => {
        if (!id) {
            return
        }
        axios.get('/api/products?id='+id).then(response => {
            setProducyInfo(response.data)
        })
    }, [])
    return (
        <Layout>
            <h1 >Edit Product</h1>
            {productInfo && (<ProductForm {...productInfo}/>)}
            
        
        </Layout>
    )
}