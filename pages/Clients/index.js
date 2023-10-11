import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { listProducts } from '../../src/graphql/queries';
import { createRequest } from '../../src/graphql/mutations';
import { Grid, Card, Button, Flex, Heading, Image, Text, useTheme } from '@aws-amplify/ui-react';
import CardGrid from '../../components/CardGrid'
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
                    const productsData = response.data.listProducts.items.filter(product => product._deleted !== true);
                    setProducts(productsData);
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
    const { tokens } = useTheme();


    return (
        <div className="product-container">
            <h1 className='title-product'>Product List</h1>
            <div className="product-list">
                {products.map(product => (
                    <div key={product.id} className="product-box">
                        <h2 className="product-name">Name: {product.name}</h2>
                        <p className="product-description">Description: {product.description}</p>
                        <p className="product-quantity">Quantity: {product.quantity}</p>
                        <button
                            className="request-button"
                            onClick={() => handleRequestClick(product)}
                        >
                            Request
                        </button>
                    </div>
                ))}
            </div>
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Request {selectedProduct.name}</h3>
                        <p>Available Quantity: {selectedProduct.quantity}</p>
                        <label>Enter Quantity:</label>
                        <input
                            type="number"
                            value={requestedQuantity}
                            min={1}
                            max={selectedProduct.quantity}
                            onChange={(e) => setRequestedQuantity(parseInt(e.target.value))}
                        />
                        <button onClick={handleRequestSubmit}>Submit Request</button>
                        <button onClick={handlePopupClose}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductList;