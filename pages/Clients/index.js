import React, { useEffect, useState } from 'react';
import { API, Auth } from 'aws-amplify';
import { listProducts } from '../../src/graphql/queries';
import { createRequest } from '../../src/graphql/mutations';
import { useRouter } from 'next/navigation';
import CardGrid from '../../components/CardGrid'
import RequestProduct from '../../components/requestproduct';
import '@aws-amplify/ui-react/styles.css';
import Sidebar from '@/components/sidebar';


function ProductList() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [requestedQuantity, setRequestedQuantity] = useState(1); // Default quantity is 1
    const [filterType, setFilterType] = useState(null); // Type filter

    const [currentUser, setCurrentUser] = useState(null);
    const [userID, setID] = useState('');
    const [role, setRole] = useState('');
    const router = useRouter();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                setCurrentUser(user);
                console.log(user)
                setID(user.attributes['custom:dataID']);
                console.log(userID);
                setRole(user.attributes['custom:role'])
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if(role === ''){
            return;
        }
        if(role === 'SUPPLIER'){
            router.push('/auth');
        }
    }, [role]);

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
        console.log("hello there!")
        setSelectedProduct(product);
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
        setRequestedQuantity(1); // Reset quantity when closing the popup
    };

    // Filter products by type
    const filteredProducts = filterType ? products.filter(product => product.type === filterType) : products;

    return (
        <div className="flex flex-row">
            <Sidebar/>
            <div className="product-container bg-white text-purple-800 text-center py-8 w-full">
                <div className="flex flex-row px-4 py-2 justify-between">
                    <div className="text-purple-800 text-3xl font-semi">
                        Product List
                    </div>

                    <div className="mb-4 px-2">
                        <label className="text-sm text-purple-800 px-1">Filter by Type:</label>
                        <select
                            className="bg-white text-purple-800 p-1 rounded border border-purple-800"
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="PERIOD_CARE">Period Care</option>
                            <option value="FOOT_HEALTH">Foot Health</option>
                            <option value="SKIN_CARE">Skin Care</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto px-4 w-full">
                    <table className="w-full table-auto border-collapse border border-purple-800 rounded-md">
                        <thead>
                            <tr className="bg-purple-800 text-white text-left">
                                <th className="p-2 text-left">Product Name</th>
                                <th className="p-2 text-left">Product Description</th>
                                <th className="p-2 text-left">Quantity</th>
                                <th className="p-2 text-left">Actions</th> {/* Added Actions column */}
                            </tr>
                        </thead>
                        {products && 
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-purple-100'}>
                                        <td className="p-2 border border-purple-800">{product?.name}</td>
                                        <td className="p-2 border border-purple-800">{product?.description}</td>
                                        <td className="p-2 border border-purple-800">{product?.quantity}</td>
                                        <td className="p-2 border border-purple-800">
                                            <button onClick={() => handleRequestClick(product)} className="bg-purple-800 text-white px-4 py-2 rounded">Request</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        }
                    </table>
                </div>

                {isPopupOpen && (
                    <RequestProduct product={selectedProduct} onClose={handlePopupClose} clientID={userID}></RequestProduct>
                )}
            </div>
        </div>
        
    );
}

export default ProductList;
