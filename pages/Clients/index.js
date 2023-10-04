import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { listProducts } from '../../src/graphql/queries';
import { createRequest } from '../../src/graphql/mutations';

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
                    const productsData = response.data.listProducts.items;
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

    return (
        <div className="product-container">
            <h1 className='title-product'>Product List</h1>
            <div>
                <label>Filter by Type:</label>
                <select onChange={(e) => setFilterType(e.target.value)}>
                    <option value="">All</option>
                    <option value="PERIOD_CARE">Period Care</option>
                    <option value="FOOT_HEALTH">Foot Health</option>
                    <option value="SKIN_CARE">Skin Care</option>
                </select>
            </div>
            <div className="product-list">
                {filteredProducts.map(product => (
                    <div key={product.id} className="product-box">
                        <h2 className="product-name">Name: {product.name}</h2>
                        <p className="product-description">Description: {product.description}</p>
                        <p className="product-quantity">Quantity: {product.quantity}</p>
                        <p className="product-type">Product Type: {product.type}</p>
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
