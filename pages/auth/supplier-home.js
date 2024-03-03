import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import { useState, useEffect } from 'react';
import { listRequests, getProduct, getUser } from '@/src/graphql/queries'; 

export default function SupplierHome() {
    let userInfo;
    const [dataID, setID] = useState('');
    const [requests, setRequests] = useState([]);
    const [products, setProducts] = useState({});
    const [clients, setClients] = useState({});
    let date;

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
                    date = new Date(request.createdAt);
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();
                    var month = date.getMonth() + 1; // Months are zero-based, so add 1
                    var day = date.getDate();
                    var year = date.getFullYear() % 100; // Get last two digits of the year


                    var ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // Handle midnight (0 hours)

                    // Format the components
                    var formattedTime = [
                        hours.toString().padStart(2, '0'),
                        minutes.toString().padStart(2, '0'),
                        seconds.toString().padStart(2, '0')
                    ].join(':');

                    var formattedDate = [
                        month.toString().padStart(2, '0'),
                        day.toString().padStart(2, '0'),
                        year.toString().padStart(2, '0')
                    ].join('/');

                    // Concatenate time, AM/PM, and date
                    var formattedDateTime = formattedTime + ' ' + ampm + ' ' + formattedDate;
                    request.createdAt = formattedDateTime;

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
                            {requests.map((request, index) => 
                                <tr key={request.id} className={index % 2 === 0 ? 'bg-white' : 'bg-purple-100'}>
                                    <td className="p-2 border border-purple-800"> { clients[request.clientID] ? 
                                        clients[request.clientID].first_name + " " + clients[request.clientID].last_name
                                        : "Loading..."
                                    } </td>
                                    <td className="p-2 border border-purple-800"> {products[request.productID] ? products[request.productID].name : "Loading..."} </td>
                                    <td className="p-2 border border-purple-800"> {products[request.productID] ? products[request.productID].description : "Loading..."} </td>
                                    <td className="p-2 border border-purple-800"> {products[request.productID] ? request.quantity : "Loading..."} </td>
                                    <td className="p-2 border border-purple-800"> {products[request.productID] ? request.createdAt : "Loading..."} </td>
                                </tr>
                            )}
                        </tbody>
                    }
                </table>
            </div>

        </div>
    );
}