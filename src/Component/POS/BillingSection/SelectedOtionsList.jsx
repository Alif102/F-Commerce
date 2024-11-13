// components/SelectedOptionsList.js

import React from 'react';
import { FaTrash } from 'react-icons/fa';

const SelectedOptionsList = ({ options, onDeleteOption }) => {
    console.log(options)
  return (
    <ul className="mb-4">
    {options.map((option, index) => (
      <li
        key={index}
        className="text-gray-700 flex items-center mb-2 border-b pb-2"
      >
        <img
          src={option.image} // Display the image
          alt={`${option.color} ${option.size}`}
          className="w-12 h-12 object-cover rounded-md mr-4"
        />
        <div className="flex-grow flex justify-between items-center">
          <span>
            {option.size} - {option.color} - {option.quantity} pcs - ৳
            {(option.quantity * option.price).toFixed(2)}
          </span>
          <button
            className="ml-4 text-white hover:bg-red-400 flex justify-center items-center h-7 px-4 p gap-3 py-1 rounded-full bg-sky-400"
            onClick={() => onDeleteOption(index)}
          >
            Remove <FaTrash className='font-bold' />
          </button>
        </div>
      </li>
    ))}
  </ul>
  );
};

export default SelectedOptionsList;
