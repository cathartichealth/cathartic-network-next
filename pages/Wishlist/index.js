import React, { useState } from 'react';
import { API, Auth } from 'aws-amplify';
import { createRequest } from '../../src/graphql/mutations';
import Sidebar from '../../components/sidebar'; // Import Sidebar component

function Wishlist() {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');

    const handleRequestSubmit = async () => {
        try {
            // Create a new request object
            const newRequest = {
                productName: productName,
                productDescription: productDescription,
                // Add any other necessary fields here
            };

            // Call the API to create the request
            await API.graphql({
                query: createRequest,
                variables: { input: newRequest },
            });

            // Reset input fields after submission
            setProductName('');
            setProductDescription('');

            // Optionally, you can display a success message or navigate to another page
        } catch (error) {
            console.error('Error creating request:', error);
            // Optionally, you can display an error message
        }
    };

    return (
        <div className="flex">
            <div className="sticky">
                <Sidebar /> {/* Render Sidebar component */}
            </div>
            <div className="flex flex-col items-center justify-center h-screen w-full">
                <h1 className="text-3xl font-semibold mb-4">Request Product</h1>
                <div className="w-full max-w-sm">
                    <div className="mb-4">
                        <label htmlFor="productName" className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
                        <input
                            id="productName"
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter product name"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="productDescription" className="block text-gray-700 text-sm font-bold mb-2">Product Description</label>
                        <textarea
                            id="productDescription"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                            placeholder="Enter product description"
                        />
                    </div>
                    <button
                        onClick={handleRequestSubmit}
                        className="bg-purple-800 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                    >
                        Request
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Wishlist;
