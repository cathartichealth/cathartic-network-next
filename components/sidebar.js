"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import { useRouter } from 'next/router';
import { HomeIcon, ShoppingCartIcon } from '@heroicons/react/outline';

function Sidebar({signOut}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState('');
    const router = useRouter();

    const handleHomeClick = () => {
        router.push('/auth');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                setCurrentUser(user);
                console.log(currentUser);
                setRole(user.attributes['custom:role']);
                // setRole("SUPPLIER");
                console.log(role);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);
    

    return (
        <div className="flex-none bg-purple-600 h-screen w-auto flex flex-col items-center">
            <div className="flex justify-between items-center">
                <img
                    className="w-24 h-24 content-start"
                    src="https://www.cathartichealth.org/wp-content/uploads/2022/10/picsvg_download.svg"
                    alt="Cathartic Network logo"
                />
                <p className="pt-2 pr-2 mr-5 text-white font-semibold">Cathartic Network</p>
            </div>
    
            {role === "CLIENT" && (
                <button 
                    className="mt-2 py-1 px-1 mx-2 w-5/6 bg-purple-600 text-left text-white hover:bg-white hover:text-purple-600 rounded-lg hover:shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 text-left flex items-center justify-between"
                    onClick={() => {
                        router.push('/Clients');
                    }}
                >
                    <span>Client Interface</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                    </svg>
                    
                </button>
            )}
            {role === "SUPPLIER" && (
                <button 
                    className="mt-2 py-1 px-1 mx-2 w-5/6 bg-purple-600 text-left text-white hover:bg-white hover:text-purple-600 rounded-lg hover:shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 text-left flex items-center justify-between"
                    onClick={() => {
                        router.push('/supplierInterface');
                    }}
                >
                    <span>Supplier Interface</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                    </svg>
                    
                </button>
            )}
    
            <button onClick={handleHomeClick} className="mt-2 py-1 px-1 mx-2 w-5/6 bg-purple-600 text-left text-white hover:bg-white hover:text-purple-600 rounded-lg hover:shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 text-left flex items-center justify-between">
                <span>Home</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
                
            </button>
        </div>
    );
    
}

export default Sidebar;
