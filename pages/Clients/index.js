import React, { useEffect, useState } from 'react';
import { API, Auth } from 'aws-amplify';
import { listProducts } from '../../src/graphql/queries';
import { createRequest } from '../../src/graphql/mutations';
import { useRouter } from 'next/navigation';
import CardGrid from '../../components/CardGrid'
import RequestProduct from '../../components/requestproduct';
import '@aws-amplify/ui-react/styles.css';


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
                <RequestProduct product={selectedProduct} onClose={handlePopupClose} clientID={userID}></RequestProduct>
            )}
        </div>
    );
}

export default ProductList;
