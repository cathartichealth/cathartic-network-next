import React, {useState, useRef, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import {API, Auth, graphqlOperation} from 'aws-amplify';
import {listProducts, productsByUserID} from '@/src/graphql/queries';
import {createProduct, updateProduct, deleteProduct} from '@/src/graphql/mutations';
import AddProduct from '../../components/addproduct';
import Sidebar from '@/components/sidebar';

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
    const [isAddModalVisible, setAddModalVisible] = useState(false);

    let userInfo;
    const [dataID, setID] = useState('');
    const [role, setRole] = useState('');
    const router = useRouter();

    useEffect(() => {
        const handleUserInfo = async () => {
            try {
                userInfo = await Auth.currentUserInfo();
                setID(userInfo.attributes['custom:dataID']);
                setRole(userInfo.attributes['custom:role']);
            } catch (error) {
                console.log("Error fetching user info:", error);
            }
        };

        handleUserInfo();
    }, []);

    useEffect(() => {
        if(role === ''){
            return;
        }
        if(role === 'CLIENT'){
            router.push("/")
        }
    })

    const handleAddIconClick = () => {
        setAddModalVisible(true);
      };
    
    const handleCloseModal = () => {
        setAddModalVisible(false);
    };

    const handleAddProduct = (newProduct) => {
    // Handle adding the new product (e.g., updating state, making API call)
    console.log('Adding product:', newProduct);
    // You may want to close the modal after adding the product
    handleCloseModal();
    };

    const handleModalClick = (e) => {
    console.log("handling modal click")    
    };


    useEffect(() => {
        document.addEventListener('click', handleModalClick);

        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleModalClick);
        };
    }, []);


    useEffect(() => {
        async function fetchProducts() {
            try {
                if (!dataID){
                    return;
                }
                console.log("Attempting fetch!");
                console.log(dataID)
                const response = await API.graphql(
                    graphqlOperation(listProducts, {
                        filter: { userID: { eq: dataID } } // Assuming supplierID is available in your scope
                    }
                ));
                      
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
        console.log("Fetching products associated with user", dataID);
        fetchProducts();
    }, [dataID, isAddModalVisible]);

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
            userID: dataID, // Use the provided userId
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
        
        <div className="flex flex-row">
            <Sidebar/>
            <div className="w-full mt-7">
                <div className="text-purple-800 text-3xl font-semi px-4 py-2">
                    Your Products
                </div>

                <div className="overflow-x-auto px-4">
                    <table className="w-full table-auto border border-purple-800">
                        <thead>
                            <tr className="bg-purple-800 text-white text-left">
                                <th className="p-2 text-left">Title</th>
                                <th className="p-2 text-left">Description</th>
                                <th className="p-2 text-left">Quantity</th>
                                <th className="p-2 text-left">Type</th>
                                <th className="p-2 text-left flex justify-between items-center">
                                    <span>Actions</span>
                                    <span
                                        className="cursor-pointer"
                                        onClick={handleAddIconClick}
                                    >
                                        <i className="fas fa-plus text-white text-xl"></i>
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products
                            .filter((product) => !product._deleted)
                            .map((product, index) => (
                                <tr key={product.id} className={ index % 2 === 0 ? 'bg-white border-b border-purple-800' : 'bg-purple-100 border-b border-purple-800'}>
                                {editedProductId === product.id ? (
                                    // Edit mode
                                    <>
                                    <td className="p-2">
                                        <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="w-full border border-purple-800 rounded-md p-2"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                        type="text"
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        className="w-full border border-purple-800 rounded-md p-2"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                        type="number"
                                        value={editedQuantity}
                                        onChange={(e) => setEditedQuantity(e.target.value)}
                                        className="w-full border border-purple-800 rounded-md p-2"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <select
                                        value={editedType}
                                        onChange={(e) => setEditedType(e.target.value)}
                                        className="w-full border border-purple-800 rounded-md p-2"
                                        >
                                        <option value="">Select Type</option>
                                        <option value="PERIOD_CARE">Period Care</option>
                                        <option value="FOOT_HEALTH">Foot Health</option>
                                        <option value="SKIN_CARE">Skin Care</option>
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <button
                                        onClick={() => saveEditedProduct(product)}
                                        className="bg-purple-800 text-white rounded-md px-4 py-2 mr-2"
                                        >
                                        Save
                                        </button>
                                        <button
                                        onClick={cancelEdit}
                                        className="bg-purple-800 text-white rounded-md px-4 py-2"
                                        >
                                        Cancel
                                        </button>
                                    </td>
                                    </>
                                ) : (
                                    // View mode
                                    <>
                                    <td className="p-2">{product.name}</td>
                                    <td className="p-2">{product.description}</td>
                                    <td className="p-2">{product.quantity}</td>
                                    <td className="p-2">{product.type}</td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => editProduct(product)}
                                            className="bg-purple-800 text-white rounded-md px-4 py-2 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteProductById(product)}
                                            className="bg-purple-800 text-white rounded-md px-4 py-2"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    </>
                                )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isAddModalVisible && (
                    <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    >
                        <div
                            className="bg-purple-800 text-white p-8 rounded-md"
                        >
                            <AddProduct onClose={handleCloseModal} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupplierInterface;
