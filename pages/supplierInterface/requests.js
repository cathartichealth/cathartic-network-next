import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { requestsByClientID, getProduct } from '@/src/graphql/queries'; // Import your GraphQL queries

function RequestListByClientID() {
    const [requests, setRequests] = useState([]);
    const [products, setProducts] = useState({});
    let userInfo = null;
    const [dataID, setID] = useState('');

    useEffect(() => {
        const handleUserInfo = async () => {
            try {
                userInfo = await Auth.currentUserInfo();
                setID(userInfo.attributes['custom:dataID']);
            } catch (error) {
                console.log("Error fetching user info:", error);
            }
        };

        handleUserInfo();

    }, []);

    useEffect(() => {
        const clientID = dataID;
        if(clientID === ''){
            return;
        }

        async function fetchRequests() {
            try {
                const response = await API.graphql(
                    graphqlOperation(requestsByClientID, {
                        clientID,
                    })
                );
                const requestItems = response.data.requestsByClientID.items;
                console.log(requestItems)
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
    }, [dataID])

    const handleDeny = (requestID) => {
        // Implement deny logic here
        console.log(`Deny request with ID: ${requestID}`);
    };

    const handleAccept = (requestID) => {
        // Implement accept logic here
        console.log(`Accept request with ID: ${requestID}`);
    };

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
                        <p>Client id: {dataID}</p>
                        <button onClick={() => handleDeny(request.id)}>Deny</button>
                        <button onClick={() => handleAccept(request.id)}>Accept</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RequestListByClientID;