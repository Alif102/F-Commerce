/* eslint-disable react/prop-types */
import React from 'react'

const AddedProductItem = ({ product }) => {
    return (
      <div className="border rounded p-2 shadow mb-2">
        <p className="text-gray-700">Name: {product.name}</p>
        <p className="text-gray-700">Price: {product.price}</p>
      </div>
    );
  };
  

export default AddedProductItem