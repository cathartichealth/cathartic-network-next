import React, {useState, useEffect} from 'react';
import { Auth } from "aws-amplify";
import {API, graphqlOperation} from 'aws-amplify';
import {listProductsByUser, getProduct} from '@/src/graphql/queries';
import {createProduct, updateProduct, deleteProduct} from '@/src/graphql/mutations';
import {Divider} from "@aws-amplify/ui-react";

import { useRouter } from "next/router"; // **updated**

const SupplierInterface = ({userId}) => {
    const [products, setProducts] = useState([]);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [newType, setNewType] = useState('');

    const [editedProductId, setEditedProductId] = useState(null);
    const [editedName, setEditedName] = useState(''); // States for editing
    const [editedDescription, setEditedDescription] = useState('');
    const [editedQuantity, setEditedQuantity] = useState('');
    const [editedType, setEditedType] = useState(''); // State for "Edit Product" dropdown

    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const user = await Auth.currentAuthenticatedUser()
            .then((userData) => {
                console.log("user is authenticated")
            })
            .catch(() => {
                router.push('.')
            })
        }

        checkAuth()
        
        async function fetchProducts() {
            try {
                const response = await API.graphql(
                    graphqlOperation(listProductsByUser, {
                        userID: 1,
                    })
                );

                console.log('GraphQL Response:', response);
                const productData = response.data.listProducts.items;
                if (productData) {
                    setProducts(productData);
                } else {
                    console.error('No products found in the response.');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProducts();
    }, [userId]);

    const addProduct = async () => {
        if (!newName || !newDescription || !newQuantity) {
            alert('Please fill in all fields.');
            return;
        }

        const newProduct = {
            name: newName,
            description: newDescription,
            quantity: parseInt(newQuantity),
            type: newType,
            userID: 1, // Use the provided userId
        };

        try {
            const response = await API.graphql({
                query: createProduct,
                variables: {
                    input: newProduct,
                },
            });

            if (response.data) {
                const newProductData = response.data.createProduct;
                console.log('Product created:', newProductData);
                setProducts((prevProducts) => [...prevProducts, newProductData]);
                // Clear the input fields
                setNewName('');
                setNewDescription('');
                setNewQuantity('');
            } else if (response.errors) {
                console.error('Mutation errors:', response.errors);
            }
        } catch (error) {
            console.error('Mutation error:', error);
        }
    };

    const editProduct = (product) => {
        // Populate the edit form with product data
        setEditedProductId(product.id);
        setEditedName(product.name);
        setEditedDescription(product.description);
        setEditedQuantity(product.quantity);
        setEditedType(product.type);
    };

    const saveEditedProduct = async (product) => {
        const editedProductData = {
            id: product.id,
            name: editedName,
            description: editedDescription,
            quantity: parseInt(editedQuantity),
            type: editedType,
            userID: 1, // Use the provided userId
            _version: product._version
        };

        console.log("edited products", editedProductData);

        try {
            const response = await API.graphql({
                query: updateProduct,
                variables: {
                    input: editedProductData,
                },
            });

            if (response.data) {
                const updatedProductData = response.data.updateProduct;
                console.log("updated products", updatedProductData);
                console.log("response data", response.data);

                // Update the product in the local state
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === updatedProductData.id ? updatedProductData : product
                    )
                );

                setEditedProductId(null);
                // Clear the edit form fields
                setEditedName('');
                setEditedDescription('');
                setEditedQuantity('');
            } else if (response.errors) {
                console.error('Mutation errors:', response.errors);
            }
        } catch (error) {
            console.error('Mutation error:', error);
        }
    };

    const cancelEdit = () => {
        // Clear the edit form
        setEditedProductId(null);
        setEditedName('');
        setEditedDescription('');
        setEditedQuantity('');
    };

    const deleteProductById = async (product) => {
        try {
            // Perform the deletion
            const deleteResponse = await API.graphql({
                query: deleteProduct,
                variables: {
                    input: {
                        id: product.id,
                        _version:product._version
                    },
                },
            });

            if (deleteResponse.data) {
                // Remove the deleted product from the local state
                setProducts((prevProducts) => prevProducts.filter((p) => p.id !== product.id));
            } else if (deleteResponse.errors) {
                console.error('Mutation errors:', deleteResponse.errors);
            }
        } catch (error) {
            console.error('Mutation error:', error);
        }
    };


    return (
        <div>
            <h1>Product Table</h1>
            <table>
                <tbody>
                {products
                    .filter((product) => !product._deleted)
                    .map((product) => (
                    <tr key={product.id}>
                        {editedProductId === product.id ? (
                            // Edit mode
                            <>
                                <td>
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={editedQuantity}
                                        onChange={(e) => setEditedQuantity(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={editedType}
                                        onChange={(e) => setEditedType(e.target.value)}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="PERIOD_CARE">Period Care</option>
                                        <option value="FOOT_HEALTH">Foot Health</option>
                                        <option value="SKIN_CARE">Skin Care</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => saveEditedProduct(product)}>Save</button>
                                    <button onClick={cancelEdit}>Cancel</button>
                                </td>
                            </>
                        ) : (
                            // View mode
                            <>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.quantity}</td>
                                <td>{product.type}</td>
                                <td>
                                    <button onClick={() => editProduct(product)}>Edit</button>
                                    <button onClick={() => deleteProductById(product)}>Delete</button>
                                </td>
                            </>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Add Product</h2>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                />
                <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                >
                    <option value="">Select Type</option>
                    <option value="PERIOD_CARE">Period Care</option>
                    <option value="FOOT_HEALTH">Foot Health</option>
                    <option value="SKIN_CARE">Skin Care</option>
                </select>
                <button onClick={addProduct}>Add</button>
            </div>
        </div>
    );
};

export default SupplierInterface;
