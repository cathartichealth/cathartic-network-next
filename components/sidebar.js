"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { Amplify, Auth, API, graphqlOperation } from 'aws-amplify';
import { useRouter } from 'next/router';
import { HomeIcon, ShoppingCartIcon } from '@heroicons/react/outline';

function Sidebar() {
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
                console.log(user)
                setRole(user.attributes['custom:role']);
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
                <span>Profile</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
    
}

export default Sidebar;
