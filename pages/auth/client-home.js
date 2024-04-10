import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { createUser } from '../../src/graphql/mutations'
import { CheckboxField, TextField, useTheme, View, Image } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
import {requestsByClientID, getProduct, listRequests, getUser} from '@/src/graphql/queries';

export default function ClientHome() {
    let userInfo;
    const [dataID, setID] = useState('');
    const [requests, setRequests] = useState([]);
    const [products, setProducts] = useState({});
    const [suppliers, setSuppliers] = useState({});
    const [showModal, setShow] = useState(false);
    const [selectedPark, setSelected] = useState({});
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
                    graphqlOperation(listRequests, {
                        filter: {
                            clientID: { eq: dataID },
                            _deleted: { ne: true}
                        }
                    })
                );

                const requestItems = response.data.listRequests.items;
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

                for(const request of requestItems){
                    console.log("checking for request ", request.productID);
                    const supplierID = request.supplierID;
                    console.log("supplierID:", supplierID);
                    if(!suppliers[supplierID]) {
                        const supplierResponse = await API.graphql(
                            graphqlOperation(getUser, {
                                id: supplierID,
                            })
                        );
                        console.log(supplierResponse.data);
                        const supplier = supplierResponse.data.getUser;
                        setSuppliers((prevSuppliers) => ({
                            ...prevSuppliers,
                            [supplierID]: supplier,
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchRequests();
    }, [dataID])

    const handleSelect = (park) => {
        setSelected(park);
        setShow(true);
    }

    const SupplierInfo = (props) => {
        const supplier = props.supplier;
        return (
            <div>
                <div className="fixed top-0 left-0 w-full h-full flex z-50 items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 w-1/3">
                        <div className='flex flex-col mb-5'>
                            <p className="text-lg mb-2"> {supplier.first_name + " " + supplier.last_name}</p>
                            <p className="text-md mb-2"> {supplier.bio ? supplier.bio : "No bio yet."}</p>
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
                <SupplierInfo
                    handleClose={() => {setShow(false)}}
                    supplier={selectedPark}
                />
            }
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
                            <th className="p-2 text-left">Supplier</th>
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
                                    <td className="p-2 border border-purple-800"> 
                                        <button className="border-b underline-offset-0 border-purple-800" onClick={() => {handleSelect(suppliers[request.supplierID])}}>
                                            { suppliers[request.supplierID] ?
                                        suppliers[request.supplierID].first_name + " " + suppliers[request.supplierID].last_name
                                        : "Loading..."
                                        }
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    }
                </table>
            </div>

        </div>
    );
}