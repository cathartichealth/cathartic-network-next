import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import { useState, useEffect } from 'react';
import { listRequests, getProduct, getUser } from '@/src/graphql/queries'; 

export default function SupplierHome() {
    let userInfo;
    const [dataID, setID] = useState('');
    const [requests, setRequests] = useState([]);
    const [products, setProducts] = useState({});
    const [clients, setClients] = useState({});

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
        if(dataID === ''){
            return;
        }

        async function fetchRequests() {
            try {
                const response = await API.graphql(
                    graphqlOperation(listRequests, {
                        filter: { supplierID: { eq: dataID } }
                    })
                );
            
                const requestItems = response.data.listRequests.items;
                console.log(requestItems);
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

                for (const request of requestItems) {
                    const clientID = request.clientID;
                    if (!clients[clientID]) {
                        const clientResponse = await API.graphql(
                            graphqlOperation(getUser, {
                                id: clientID,
                            })
                        );
                        const client = clientResponse.data.getUser;
                        setClients((prevClients) => ({
                            ...prevClients,
                            [clientID]: client,
                        }));
                    }
                }
                console.log(requests);
                console.log(products);
                console.log(clients);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchRequests();
    }, [dataID])

    return (
        <div>
            <div className="text-purple-800 text-3xl font-semi pt-4">
                Your Requests
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-auto border border-purple-800 rounded-md">
                    <thead>
                        <tr className="bg-purple-800 text-white text-left">
                            <th className="p-2 text-left">Client Name</th>
                            <th className="p-2 text-left">Product Name</th>
                            <th className="p-2 text-left">Product Description</th>
                            <th className="p-2 text-left">Quantity</th>
                            <th className="p-2 text-left">Requested At:</th>
                        </tr>
                    </thead>
                    {requests && clients && products && 
                        <tbody>
                            {requests.map((request) => 
                                <tr key={request.id}>
                                    <td className="p-2"> { clients[request.clientID] ? 
                                        clients[request.clientID].first_name + clients[request.clientID].last_name
                                        : "Loading..."
                                    } </td>
                                    <td className="p-2"> {products[request.productID] ? products[request.productID].name : "Loading..."} </td>
                                    <td className="p-2"> {products[request.productID] ? products[request.productID].description : "Loading..."} </td>
                                    <td className="p-2"> {request.quantity} </td>
                                    <td className="p-2"> {request.createdAt} </td>
                                </tr>
                            )}
                        </tbody>
                    }
                </table>
            </div>

        </div>
    );
}