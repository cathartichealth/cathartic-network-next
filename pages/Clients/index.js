import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { listProducts } from '../../src/graphql/queries.js';


function ProductList() {
    const [products, setProducts] = useState([]);

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

    return (
        <div className="product-container">
            <h1 className='title-product'>Product List</h1>
            <div className="product-list">
                {products.map(product => (
                    <div key={product.id} className="product-box">
                        <h2 className="product-name">Name: {product.name}</h2>
                        <p className="product-description">Description: {product.description}</p>
                        <p className="product-quantity">Quantity: {product.quantity}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
