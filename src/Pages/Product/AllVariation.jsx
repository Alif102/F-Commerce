import React, { useState, useEffect } from 'react';
import { CiMenuKebab } from "react-icons/ci";
import axios from "axios";
import { Link } from 'react-router-dom';
import { FaEye, FaRegEdit, FaPlus, FaMinus } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { ImSpinner10 } from 'react-icons/im';

const AllVariation = () => {
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [variations, setVariations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [variationName, setVariationName] = useState('');
  const [inputFields, setInputFields] = useState([]);
  const [errors, setErrors] = useState({});
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");
  const [loading, setLoading] = useState(false);

console.log(userId)
  useEffect(() => {
    const fetchAllVariations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://admin.ezicalc.com/api/get_all_variation/${clientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const variations = response.data.data || [];
        setVariations(variations);
      } catch (error) {
        console.error('Error fetching variations:', error);
      }finally{
        setLoading(false);
      }
    };

    fetchAllVariations();
  }, [token, userId]);

  const openModal = (variation) => {
    setVariationName(variation.variation_name);
    setInputFields(variation.values.map((value, index) => ({ id: index, value })));
    setSelectedVariation(variation);
    setModalOpen(true);
  };

  const handleInputChange = (id, value) => {
    setInputFields(inputFields.map(field => field.id === id ? { ...field, value } : field));
  };

  const handleAddField = () => {
    setInputFields([...inputFields, { id: inputFields.length, value: '' }]);
  };

  const handleDeleteField = (id) => {
    setInputFields(inputFields.filter(field => field.id !== id));
  };

  const closeModal = () => {
    setModalOpen(false);
    setVariationName('');
    setInputFields([]);
    setErrors({});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    const updatedValues = inputFields.map(field => field.value.trim()).filter(value => value !== '');

    if (updatedValues.length === 0) {
        setErrors({ apiError: 'At least one value must be provided.' });
        return;
    }

    const valuesString = updatedValues.join(','); 

    const submitData = {
        client_id: clientId,
        variation_id: selectedVariation.variation_id,  
        user_id: userId,
        name: variationName.trim(),  
        value: valuesString, 
    };
    setLoading(true);
    try {
        const response = await axios.post('https://admin.ezicalc.com/api/variation/update', submitData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.data.status) {
            // Update the variations state locally
            const updatedVariation = { 
                ...selectedVariation, 
                variation_name: variationName.trim(), 
                values: updatedValues 
            };

            setVariations(variations.map(v => 
                v.variation_id === selectedVariation.variation_id ? updatedVariation : v
            ));

            toast.success(response.data.message || 'Variation updated successfullyyyyyy');
            closeModal();
        } else {
            setErrors({ apiError: response.data.message });
        }
    } catch (error) {
        console.error('Error updating variation:', error);
        setErrors({ apiError: 'Failed to update variation.' });
    }finally {
      setLoading(false);
    }
};


const handleDelete = async (id) => {
  // Show a confirmation dialog
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`https://admin.ezicalc.com/api/variation/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        Swal.fire('Deleted!', response.data.message || 'Variation deleted successfullyyy.');

        // Remove the deleted SMS from the state
        setVariations((variation) => variation.filter((vari) => vari.variation_id !== id));
      } else {
        Swal.fire('Error!', response.data.message || 'Failed to delete SMS.', 'error');
      }
    } catch (error) {
      console.error('Error deleting SMS:', error.response ? error.response.data : error.message);
      Swal.fire('Error!', 'Failed to delete SMS.', 'error');
    }
  }
};


console.log(variations)

  return (
    <div className="mx-4 md:mx-10">
      <div className=" justify-between w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300">
        <h2 className="px-4 text-xl font-semibold">Variation</h2>
        <div className="flex">
          <Link to="/product/variation/create">
            <button className="ml-auto bg-[#28DEFC] text-white font-semibold py-1 px-6 mr-5 rounded hover:bg-[#28DEFC] transition duration-200">
              Add New
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-auto xl:overflow-hidden mt-6 pb-32">
        <table className="table">
          <thead className="text-gray-600 bg-[#EFEFEF]">
            <tr>
              <th className="text-[15px]">SL</th>
              <th className="text-[15px]">Variation Name</th>
              <th className="text-[15px]">Value</th>
              <th className="text-[15px]">Action</th>
            </tr>
          </thead>
          <tbody>
      {loading ? (
        <tr>
          <td colSpan="4" className="text-center text-gray-900">
          <span className="loading loading-ring loading-md"></span>
          <h1>Loading Variations...</h1>
          </td>
        </tr>
      ) : (
        variations.map((variation, index) => (
          <tr key={variation.variation_id} className="hover">
            <th className="text-[15px]">{index + 1}</th>
            <td className="text-[15px]">{variation.variation_name}</td>
            <td className="text-[15px] w-[30%]">
              {variation.values.join(', ')}
            </td>
            <td>
              <div className="dropdown dropdown-end">
                <button className="text-[20px]">
                  <CiMenuKebab />
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li>
                    <a>
                      <FaEye className="text-blue-500 text-[20px] pl-1" />
                      View
                    </a>
                  </li>
                  <li>
                    <a onClick={() => openModal(variation)}>
                      <FaRegEdit className="text-green-500 text-[20px] pl-1" />
                      Edit
                    </a>
                  </li>
                  <li>
                    <a onClick={() => handleDelete(variation.variation_id)}>
                      <MdDeleteForever className="text-red-500 text-[20px]" />
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl mb-4">Edit Variation</h2>
            <form onSubmit={handleEditSubmit}>
              <p className="mb-4">Value Name</p>
              <input
                type="text"
                name="variation_name"
                className="form-control text-lowercase shadow-[0_3px_10px_rgb(0,0,0,0.2)] py-2 px-3 w-full hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter variation name"
                value={variationName}
                onChange={(e) => setVariationName(e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

              <p className="mb-4 mt-5">Value</p>
              {inputFields.map((field, index) => (
                <div key={field.id} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="form-control text-lowercase shadow-[0_3px_10px_rgb(0,0,0,0.2)] py-2 px-3 w-[50%] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter value ${index + 1}`}
                    value={field.value}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                  />
                  {index === inputFields.length - 1 && (
                    <button
                      type="button"
                      className="ml-2 bg-sky-400 text-white px-2 py-2 cursor-pointer rounded-md"
                      onClick={handleAddField}
                    >
                      <FaPlus />
                    </button>
                  )}
                  {inputFields.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 bg-slate-500 text-white px-2 py-2 cursor-pointer rounded-md"
                      onClick={() => handleDeleteField(field.id)}
                    >
                      <FaMinus />
                    </button>
                  )}
                </div>
              ))}

              {errors.apiError && (
                <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
    type="submit"
   className="btn bg-sky-400 text-white"

  >
    {loading ? (
      <div className='flex justify-center items-center w-full'>
        <ImSpinner10 className='animate-spin text-white' size={20} />
        <span className='px-2'>Updating...</span>
      </div>
    ) : (
      <>
       <h1  className=" bg-sky-400 text-white ">Update</h1>
      </>
    )}
  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllVariation;
