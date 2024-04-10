import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import { useState, useEffect } from 'react';
import { listRequests, getProduct, getUser } from '@/src/graphql/queries';
import {deleteRequest, updateRequest} from "@/src/graphql/mutations";
import { StatusEnum} from "@/src/models";

export default function SupplierHome() {
    let userInfo;
    const [dataID, setID] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [products, setProducts] = useState({});
    const [clients, setClients] = useState({});
    const [showModal, setShow] = useState(false);
    const [selectedClient, setSelected] = useState({});
    let date;

    useEffect(() => {
        if(pendingRequests == []){
            return;
        }
        console.log("Pending Requests");
        console.log(pendingRequests);
        console.log("Accepted Requests");
        console.log(acceptedRequests);

    }, [pendingRequests, acceptedRequests]);

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

    const handleAcceptRequest = (request) => {
        if (window.confirm("Are you sure you want to accept this request?")) {
            // Perform accept action
            const acceptRequest = async () => {
                try {
                    // Update the status of the request to "ACCEPTED"
                    const updatedRequest = {
                        id: request.id, // Include the ID of the request to update
                        status: 'APPROVED', // Update the status to "ACCEPTED
                        _version: request._version, // Include the version of the request to update
                    };
                    // Define the variables for the mutation
                    console.log("updated requests", updatedRequest)
                    // Update the request status in the backend

                    const response = await API.graphql({
                        query: updateRequest,
                        variables: {
                            input: updatedRequest,
                        },
                    });

                    console.log('GraphQL response:', response);

                    // Move the request from pendingRequests to acceptedRequests
                    const updatedPendingRequests = pendingRequests.filter(req => req.id !== request.id);
                    setPendingRequests(updatedPendingRequests);
                    console.log(pendingRequests);
                    setAcceptedRequests([...acceptedRequests, updatedRequest]);
                    console.log(acceptedRequests);
                } catch (error) {
                    console.error('Error accepting request:', error);
                }
            };
            acceptRequest();
        }
    };

    const handleDenyRequest = (request) => {
        if (window.confirm("Are you sure you want to deny this request?")) {
            // Perform deny action
            const denyRequest = async () => {
                try {
                    // Delete the request from the backend
                    const response = await API.graphql({
                        query: deleteRequest,
                        variables: {
                            input: {
                                id: request.id,
                                _version: request._version,
                            },
                        },
                    });

                    // Remove the request from pendingRequests
                    const updatedPendingRequests = pendingRequests.filter(req => req.id !== request.id);
                    setPendingRequests(updatedPendingRequests);
                } catch (error) {
                    console.error('Error denying request:', error);
                }
            };

            denyRequest();
        }
    };

    useEffect(() => {
        if(dataID === ''){
            return;
        }

        async function fetchRequests() {
            try {
                const response = await API.graphql(
                    graphqlOperation(listRequests, {
                        filter: {
                            supplierID: { eq: dataID },
                            // not equal to true
                            _deleted: { ne: true}
                        }
                    })
                );
                const requestItems = response.data.listRequests.items;

                const pending = requestItems.filter(request => request.status === 'PENDING');
                const accepted = requestItems.filter(request => request.status === 'APPROVED');

                setPendingRequests(pending);
                setAcceptedRequests(accepted);

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

    const handleSelect = (client) => {
        setSelected(client);
        setShow(true);
    }

    const ClientInfo = (props) => {
        const client = props.client;
        return (
            <div>
                <div className="fixed top-0 left-0 w-full h-full flex z-50 items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 w-1/3">
                        <div className='flex flex-col mb-5'>
                            <p className="text-lg mb-2"> {client.first_name + " " + client.last_name}</p>
                            <p className="text-md mb-2"> {client.bio ? client.bio : "No bio yet."}</p>
                        </div>
                        
                        <div className="flex justify-right">
                            <button
                                id="exit"
                                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-purple rounded-lg"
                                onClick={() => {props.handleClose()}}
                            >
                                Exit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {
                showModal &&
                <ClientInfo
                    handleClose={() => {setShow(false)}}
                    client={selectedClient}
                />
            }

            <div className="text-purple-800 text-3xl font-semi pt-4">
                Pending Requests
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
                        <th className="p-2 text-left">Actions:</th>
                    </tr>
                    </thead>
                    {pendingRequests && clients && products &&
                        <tbody>
                        {pendingRequests.map((request, index) =>
                            <tr key={request.id} className={index % 2 === 0 ? 'bg-white' : 'bg-purple-100'}>
                                <td className="p-2 border border-purple-800"> 
                                    <button className="border-b underline-offset-0 border-purple-800" onClick={() => {handleSelect(clients[request.clientID])}}>
                                    { clients[request.clientID] ?
                                        clients[request.clientID].first_name + " " + clients[request.clientID].last_name
                                        : "Loading..."
                                    } 
                                    </button>
                                </td>
                                <td className="p-2 border border-purple-800"> {products[request.productID] ? products[request.productID].name : "Loading..."} </td>
                                <td className="p-2 border border-purple-800"> {products[request.productID] ? products[request.productID].description : "Loading..."} </td>
                                <td className="p-2 border border-purple-800"> {products[request.productID] ? request.quantity : "Loading..."} </td>
                                <td className="p-2 border border-purple-800"> {products[request.productID] ? request.createdAt : "Loading..."} </td>
                                <td className="p-2 border border-purple-800">
                                    <div className="flex flex-row">
                                        <button className="mr-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => handleAcceptRequest(request)}>
                                            Accept
                                        </button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => handleDenyRequest(request)}>
                                            Deny
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    }
                </table>
            </div>

            <div className="text-purple-800 text-3xl font-semi pt-4">
                Accepted Requests
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
                    {acceptedRequests && clients && products &&
                        <tbody>
                        {acceptedRequests.map((request, index) =>
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