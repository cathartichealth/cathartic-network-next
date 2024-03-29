import React, {useState, useEffect} from 'react';
import { API, Auth, Storage } from 'aws-amplify';
import { ProgramEnum } from '@/src/models';
import {createProduct} from '@/src/graphql/mutations';

const AddProduct = ({ onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState();
    
    let userInfo;
    const [dataID, setID] = useState('');
    const [role, setRole] = useState('');

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

    const handleAddProduct = async () => {
      if (!name || !description || !quantity || !type) {
          alert('Please fill in all fields.');
          return;
      }

      let inputImageKey = '';
      if (image) {
        const result = await Storage.put(image.name, image, {
          contentType: image.type,
        });
        inputImageKey = result.key;
      }

      let enumType;
      console.log(type);
      if(type === "Skin Care"){
        enumType = ProgramEnum.SKIN_CARE
      }
      else if(type === "Foot Health"){
        enumType = ProgramEnum.FOOT_HEALTH
      }
      else if (type === "Period Care"){
        enumType = ProgramEnum.PERIOD_CARE
      }
    
      const newProduct = {
        name: name,
        description: description,
        quantity: parseInt(quantity),
        type: type,
        userID: dataID,
        imageKey: inputImageKey,
        // _deleted: false
      };
      console.log(newProduct);
    
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
              // Clear the input fields
              setName('');
              setDescription('');
              setQuantity('');
              setImage(null);
              onClose();
          } else if (response.errors) {
              console.error('Mutation errors:', response.errors);
          }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  }

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
          className="bg-white text-purple-400 px-4 py-2 rounded "
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
