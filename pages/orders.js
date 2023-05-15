import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage(){
    const [orders, setOrders] = useState([])
    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data)
            console.log(response.data)
        } )
    },[])
    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order._id}>
                            <td>{new Date(order.createdAt).toLocaleString()
                            }</td>
                            <td>{order.name}{order.email}<br/>
                            {order.city}{order.postCode}
                            {order.country}<br />
                            {order.address}
                            </td>
                            <td>
                                {order.line_items.map(l =>(
                                    <>
                                    {l.price_data?.product_data.name} x {l.quantity}
                                   <br />
                                    </>
                                ))}
                            </td>
                            
                        </tr>
                    ))}

                </tbody>
            </table>
        </Layout>
    )
}