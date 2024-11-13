import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditSingleProduct = () => {
  const { id } = useParams();  // Get the product ID from the URL params
  const [product, setProduct] = useState(null); // Store the product data
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch the product using the ID and token
        const response = await axios.get(`https://admin.ezicalc.com/api/product/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Make sure you're accessing the correct data
        setProduct(response.data.data);  // Assuming the product is inside response.data.data
      } catch (error) {
        console.error('Error fetching product:', error.response ? error.response.data : error.message);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, token]); 
  console.log(product) // Include token in dependencies in case it changes

  // Display loading message until product is fetched
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-4 md:mx-10">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Product Name:</h3>
        <p className="text-gray-700">{product?.name}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Short Description:</h3>
        <p className="text-gray-700">{product?.short_desc}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Price:</h3>
        <p className="text-gray-700">৳{product?.price}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Stock:</h3>
        <p className="text-gray-700">{product?.stock} pcs</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Variations:</h3>
        {product?.product_variation?.map((variation) => (
          <p key={variation.id} className="text-gray-700">
            {variation.variation.name}: {variation.variaton_values}
          </p>
        ))}
      </div>
      {/* Additional fields for editing can be added here */}
    </div>
  );
};

export default EditSingleProduct;
