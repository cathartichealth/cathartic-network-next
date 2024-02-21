import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listProducts, getProduct } from '@/src/graphql/queries';
import { createProduct, updateProduct, deleteProduct } from '@/src/graphql/mutations';
import { Storage } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { UNSAFE_useRouteId } from 'react-router-dom';





const AddProduct = ({ onClose, onAddProduct }) => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [userID, setUserID] = useState(null)
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const user = await Auth.currentAuthenticatedUser();
        console.log("useffect")

        const dataID = user.attributes['custom:dataID'];
        setUserID(dataID);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);


  

  



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  }

  const handleAddProduct = async () => {
    if (!name || !description || !quantity || !type) {
      alert('Please fill in all fields.');
      return;
    }

    

    try {
      let imageKey = '';
      if (image) {
        const result = await Storage.put(image.name, image, {
          contentType: image.type,
        });
        imageKey = result.key;
        console.log(imageKey)
      }
      const newProduct = {
        name: name,
        description: description,
        quantity: parseInt(quantity),
        type: type,
        userID,
        imageKey: imageKey,
        _deleted: false
      };

      console.log(newProduct)

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
        onClose();
        setImage(null)
      } else if (response.errors) {
        console.error('Mutation errors:', response.errors);
      }
    } catch (error) {
      console.error('Mutation error:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-purple-600 text-white p-8 rounded-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white cursor-pointer"
        >
          X
        </button>
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>

        <div className="mb-4">
          <label className="block">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-white rounded text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-white rounded text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block">Type:</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-white rounded text-black"
          >
            <option value="" disabled>Select a type</option>
            <option value="PERIOD_CARE">Period Care</option>
            <option value="FOOT_HEALTH">Foot Health</option>
            <option value="SKIN_CARE">Skin Care</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border border-white rounded text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block">Image:</label>
          <input
            type="file" accept = "image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-white rounded text-black"
          />
        </div>

        <button
          onClick={handleAddProduct}
          className="bg-white text-purple-400 px-4 py-2 rounded text-black"
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
