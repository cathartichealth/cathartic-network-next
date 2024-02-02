import React, {useState, useEffect} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {listProducts, getProduct} from '@/src/graphql/queries';
import {createProduct, updateProduct, deleteProduct} from '@/src/graphql/mutations';

const AddProduct = ({ onClose, onAddProduct }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [quantity, setQuantity] = useState('');
  
    const handleAddProduct = () => {
      // Validate input fields if needed
      // ...
  
      // Call the onAddProduct callback with the product details
      onAddProduct({ name, description, type, quantity });
  
      // Clear the form fields
      setName('');
      setDescription('');
      setType('');
      setQuantity('');
  
      // Close the modal
      onClose();
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-purple-800 text-white p-8 rounded-md">
          <h2 className="text-2xl font-bold mb-4">Add Product</h2>
  
          <div className="mb-4">
            <label className="block">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-white rounded"
            />
          </div>
  
          <div className="mb-4">
            <label className="block">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-white rounded"
            />
          </div>
  
          <div className="mb-4">
            <label className="block">Type:</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border border-white rounded"
            />
          </div>
  
          <div className="mb-4">
            <label className="block">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border border-white rounded"
            />
          </div>
  
          <button
            onClick={handleAddProduct}
            className="bg-white text-purple-800 px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>
      </div>
    );
  };
  
  export default AddProduct;
  