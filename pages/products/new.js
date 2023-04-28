import ProductForm from "@/components/ProductForm";
import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function NewProduct() {
    return(
        <Layout>
             <h1 >New Product</h1>
            <ProductForm/>     
        </Layout>
    )
}