import React, {useState, useEffect} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import { createRequest } from '../src/graphql/mutations';

const RequestProduct = ({ product, onClose }) => {
    const [requestedQuantity, setRequestedQuantity] = useState(); // Default quantity is 1

    const handleRequestSubmit = async () => {
        try {
            // Create a request using the GraphQL mutation
            let quantity = parseInt(requestedQuantity);
            if(isNaN(quantity)){
                alert("Please enter a number.");
                return;
            }
            if(quantity > product.quantity){
                alert("You cannot request more than the available quantity.")
                return;
            }
            const requestInput = {
                input: {
                    quantity: requestedQuantity,
                    clientID: 1,
                    productID: product.id, // Use productID as provided by your schema
                    supplierID: product.userID, // Use userID as provided by your schema
                },
            };

            const response = await API.graphql({
                query: createRequest,
                variables: requestInput,
            });

            console.log('Request created:', response.data.createRequest);
            onClose();
        // Handle any additional logic or UI updates as needed
        } catch (error) {
            console.error('Error creating request:', error);
            onClose();
        }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-purple-800 text-white p-8 rounded-md">
          <button
              onClick={onClose}
              className="absolute top-2 right-2 text-white cursor-pointer"
          >
            X
          </button>
          <h2 className="text-2xl font-bold mb-4">Request {product.name}</h2>

          <div className="mb-4">
            <label className="block">Available Quantity: {product.quantity} </label>
            <input
                type="text"
                value={requestedQuantity}
                label="Enter Quantity: "
                min={1}
                max={product.quantity}
                onChange={(e) => setRequestedQuantity(e.target.value)}
                className="w-full p-2 border border-white rounded text-black"
            />
          </div>
          <button
            onClick={handleRequestSubmit}
            className="bg-white text-purple-800 px-4 py-2 rounded text-black"
          >
            Submit Request
          </button>
        </div>
      </div>
    );
  };
  
  export default RequestProduct;
  