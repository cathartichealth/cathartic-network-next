import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { createUser } from '../../src/graphql/mutations'
import { CheckboxField, TextField, useTheme, View, Image } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
import { requestsByClientID, getProduct } from '@/src/graphql/queries'; 

export default function ClientHome() {
    let userInfo;
    const [dataID, setID] = useState('');
    const [requests, setRequests] = useState([]);
    const [products, setProducts] = useState({});
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

                    console.log(formattedDateTime);
                    request.createdAt = formattedDateTime;

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

    return (
        <div>
            <div className="text-purple-800 text-3xl font-semi pt-4">
                Your Requests
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-auto border border-purple-800 rounded-md">
                    <thead>
                        <tr className="bg-purple-800 text-white text-left">
                            <th className="p-2 text-left">Product Name</th>
                            <th className="p-2 text-left">Product Description</th>
                            <th className="p-2 text-left">Quantity</th>
                            <th className="p-2 text-left">Requested At:</th>
                        </tr>
                    </thead>
                    {requests && 
                        <tbody>
                            {requests.map((request, index) => 
                                <tr key={request.id} className={index % 2 === 0 ? 'bg-white' : 'bg-purple-100'}>
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