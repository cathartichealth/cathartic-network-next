import React, { useEffect, useState } from 'react';
import { API, Auth } from 'aws-amplify';
import { listProducts } from '../../src/graphql/queries';
import { useRouter } from 'next/navigation';
import RequestProduct from '../../components/requestproduct';
import { Storage } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import Sidebar from '@/components/sidebar';
import Image from 'next/image';


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
        // Disable vertical scrolling on the body element
        document.body.style.overflowY = 'hidden';

        // Re-enable scrolling on component unmount
        return () => {
            document.body.style.overflowY = 'auto';
        };
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
                                return {...product, imagelink: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987"};
                                
                                
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

    useEffect(() => {
        if(!products){
            return;
        }
        console.log(products)
    }, [products])

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
        <div className="flex flex-row h-screen">
            <div className="w-1/5">
                <Sidebar/>
            </div>
            <div className="flex flex-col w-full overflow-auto">
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
                                        <tr key={product.id} className={index % 2 === 0 ? 'bg-white border border-purple-800' : 'bg-purple-100 border border-purple-800'}>
                                            <td className="p-2 text-left border border-purple-800 align-middle">
                                                <div className="flex flex-col">
                                                    <div>
                                                        {product?.name}
                                                    </div>
                                                    <img
                                                        src={product?.imagelink}
                                                        className="w-[150px] h-[150px] align-top"
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-2 text-left border border-purple-800  align-top">
                                                <div>
                                                    {product?.description}
                                                </div>
                                            </td>
                                            <td className="p-2 text-left border border-purple-800  align-top">
                                                <div>
                                                    {product?.quantity}
                                                </div>
                                            </td>
                                            <td className="p-2 text-left border border-purple-800  align-top">
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
        </div>
        
    );
}

export default ProductList;
