import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { requestsByClientID, getProduct } from '@/src/graphql/queries'; // Import your GraphQL queries

function RequestListByClientID() {
    const [requests, setRequests] = useState([]);
    const [products, setProducts] = useState({});
    const clientID = "c32a4427-fa50-4c9e-b230-883ddd117eef"; // Replace with your client ID

    useEffect(() => {
        async function fetchRequests() {
            try {
                const response = await API.graphql(
                    graphqlOperation(requestsByClientID, {
                        clientID,
                        // You can add any additional filtering, sorting, and limiting parameters here
                    })
                );
                const requestItems = response.data.requestsByClientID.items;
                setRequests(requestItems);

                // Fetch product data for each request
                for (const request of requestItems) {
                    const productID = request.productID;
                    if (!products[productID]) {
                        const productResponse = await API.graphql(
                            graphqlOperation(getProduct, {
                                id: productID,
                            })
                        );
                        const product = productResponse.data.getProduct;
                        setProducts((prevProducts) => ({
                            ...prevProducts,
                            [productID]: product,
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchRequests();
    }, [clientID]);

    return (
        <div>
            <h1>Request List by Client ID</h1>
            <ul>
                {requests.map((request) => (
                    <li key={request.id}>
                        <p>Product Name: {products[request.productID]?.name}</p>
                        <p>Product Description: {products[request.productID]?.description}</p>
                        <p>Quantity: {request.quantity}</p>
                        <p>Created At: {request.createdAt}</p>
                        {/* Add other fields you want to display */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RequestListByClientID;
