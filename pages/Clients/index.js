import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { listProducts } from '../../src/graphql/queries';
import { createRequest } from '../../src/graphql/mutations';
import CardGrid from '../../components/CardGrid'
import RequestProduct from '../../components/requestproduct';
import { Storage } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';


function ProductList() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [requestedQuantity, setRequestedQuantity] = useState(1); // Default quantity is 1
    const [filterType, setFilterType] = useState(null); // Type filter

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await API.graphql({ query: listProducts });
                

                if (response.data && response.data.listProducts && response.data.listProducts.items) {
                    // const productsData = response.data.listProducts.items.filter(product => product._deleted !== true);
                    // setProducts(productsData);
                    const filteredProducts = response.data.listProducts.items.filter(product => product._deleted !== true);

                    const productsWithImageLinks = await Promise.all(filteredProducts.map(async (product) => {
                        if (product.imageKey) {
                            try {
                                const imageUrl = await Storage.get(product.imageKey, { level: 'public' });
                                return { ...product, imagelink: imageUrl };
                            } catch (error) {
                                console.error(`Error fetching image for product ${product.id}:`, error);
                                return {...product, imageLink: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987"};
                                
                                
                            }
                        } else {
                            return {...product, imagelink: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987"};
                        }
                    }));
                    setProducts(productsWithImageLinks);
                } else {
                    console.error('Response structure is not as expected:', response);
                }
            } catch (error) {
                console.error('Error fetching all products:', error);
            }
        }

        fetchProducts();
    }, []);

    const handleRequestClick = (product) => {
        console.log("hello there!")
        setSelectedProduct(product);
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
        setRequestedQuantity(1); // Reset quantity when closing the popup
    };

    const handleRequestSubmit = async () => {
        try {
            // Create a request using the GraphQL mutation
            const requestInput = {
                input: {
                    quantity: requestedQuantity,
                    clientID: 1,
                    productID: selectedProduct.id, // Use productID as provided by your schema
                    supplierID: selectedProduct.userID, // Use userID as provided by your schema
                },
            };

            const response = await API.graphql({
                query: createRequest,
                variables: requestInput,
            });

            console.log('Request created:', response.data.createRequest);


        // Handle any additional logic or UI updates as needed
        } catch (error) {
            console.error('Error creating request:', error);
        }

        setIsPopupOpen(false);
        setSelectedProduct(null);
        handlePopupClose();
    };

    // Filter products by type
    const filteredProducts = filterType ? products.filter(product => product.type === filterType) : products;

    return (
        <div className="product-container bg-white text-purple-800 text-center py-8">
            <h1 className='title-product text-3xl font-bold mb-4'>Product List</h1>

            <div className="mb-4">
                <label className="text-sm text-purple-800">Filter by Type:</label>
                <select
                    className="bg-white text-purple-800 p-2 rounded border border-purple-800"
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="PERIOD_CARE">Period Care</option>
                    <option value="FOOT_HEALTH">Foot Health</option>
                    <option value="SKIN_CARE">Skin Care</option>
                </select>
            </div>

            <div className="product-list">
                <CardGrid items={filteredProducts} buttonHandler={handleRequestClick}></CardGrid>
            </div>

            {isPopupOpen && (
                // <div className="popup-overlay">
                //     <div className="popup bg-white text-purple-800 p-8 rounded">
                //         <h3 className="text-xl font-bold mb-4">Request {selectedProduct.name}</h3>
                //         <p>Available Quantity: {selectedProduct.quantity}</p>
                //         <label className="block text-sm text-purple-800">Enter Quantity:</label>
                //         <input
                //             type="number"
                //             value={requestedQuantity}
                //             min={1}
                //             max={selectedProduct.quantity}
                //             onChange={(e) => setRequestedQuantity(parseInt(e.target.value))}
                //             className="w-full p-2 border border-purple-800 rounded mb-4"
                //         />
                //         <button
                //             onClick={handleRequestSubmit}
                //             className="bg-purple-800 text-white px-4 py-2 rounded mr-2"
                //         >
                //             Submit Request
                //         </button>
                //         <button
                //             onClick={handlePopupClose}
                //             className="bg-white text-purple-800 px-4 py-2 rounded border border-purple-800"
                //         >
                //             Cancel
                //         </button>
                //     </div>
                // </div>
                <RequestProduct product={selectedProduct} onClose={handlePopupClose}></RequestProduct>
            )}
        </div>
    );
}

export default ProductList;
