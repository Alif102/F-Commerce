import React, { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { CiMenuKebab } from "react-icons/ci";
import { FaEye, FaSpinner, FaTimes } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { ImSpinner10 } from "react-icons/im";

const StockLocation = () => {

  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");


  const handleErrors = (newErrors) => {
    setErrors(newErrors);
  };




const [name, setName] = useState('');
const [location, setLocation] = useState('');
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);

const handleSave = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('name', name);
    formData.append('location', location);
  
    setLoading(true); // Start loading
    try {
      const response = await axios.post('https://admin.ezicalc.com/api/stock_location/create', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.data.status) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: response.data.message || "Stock Location created successfully.!",
          showConfirmButton: false,
          timer: 2000
        });
  
        // Reset form fields
        setName('');
        setLocation('');
        setErrors({});
        handleErrors('');
  
        // Refetch stock locations after a successful addition
        // await fetchStockLocations();
  
        document.getElementById('my_modal_3').close();
      } 
      

      if (!response.data.status) {
        toast.error(response.data.message)

      }
      if (response.data.error) {
        toast.error(Object.keys(response.data.error).map((field) => ` ${response.data.error[field][0]}`));

        const newErrors = response.data.error || {};
        setErrors(newErrors);
        handleErrors(newErrors);
  
      }
      
      
      else {
      
        // toast.error(Object.keys(response.data.error).map((field) => ` ${response.data.error[field][0]}`));
      }
    } catch (error) {
      console.error('Error saving Stock Location:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Separate function to refetch stock locations
  // const fetchStockLocations = async () => {
  //   try {
  //     const response = await axios.get(`https://admin.ezicalc.com/api/stock_location/get/${clientId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response.data.status) {
  //       setStockLocations(response.data.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching the stock locations:", error);
  //   }
  // };
  
  // useEffect(() => {
  //   fetchStockLocations(); // Initial fetch on component mount
  // }, [clientId, token]);
  




//   Gettt
const [stockLocations, setStockLocations] = useState([]);
useEffect(() => {
    axios
      .get(`https://admin.ezicalc.com/api/stock_location/get/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status) {
          setStockLocations(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching the stock locations:", error);
      });
  }, [clientId, token]);
  
console.log(stockLocations)


const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedLocation, setSelectedLocation] = useState(null);

// const handleEdit = (location) => {
//   setSelectedLocation(location); // Store the selected location data
//   setIsModalOpen(true); // Open the modal
// };

const [editId, setEditId] = useState('');
const [editName, setEditName] = useState('');
const [editLocation, setEditLocation] = useState('');
const handleEdit = (location) => {


  console.log(location);



setEditId(location.id)
  setEditName(location.name);
  setEditLocation(location.location);




  setIsModalOpen(true); // Open the modal
};
const handleEditSave = async (e) => {
  e.preventDefault();

  const formData = new FormData();
 
  formData.append("location_id", editId);
  formData.append("name", editName);

  formData.append("location", editLocation);


  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  setLoading(true);
  try {
    const response = await axios.post(
      "https://admin.ezicalc.com/api/stock_location/update",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    console.log(response);


    if (response.data.status) {


      toast.success(
        response.data.message || "Location Edited successfullyyy!",
        {
          duration: 2000,
          position: "top-right",
        }
      );

      // Reset form fields
      setEditName("");
      setEditLocation("");
      
      setIsModalOpen(false);
      
      fetchStockLocations();
    } else {
      setErrors(response.data.error || {});
     
    }
  } catch (error) {
    toast.error(error.response ? error.response.data : error.message
    );
    toast.error(
      "An error occurred while saving the business. Please try again."
    );
  }finally {
    setLoading(false); 
  }
}; 
const handleDelete = (id) => {
  // Handle the delete logic here
  console.log("Deleting location with ID:", id);
};

const closeModal = () => {
  setIsModalOpen(false);
  setSelectedLocation(null);
};



  return (
    <div className="mx-4 md:mx-10">
      <div className="w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300">
        <h2 className="px-4 text-xl font-semibold">Wirehouse Location</h2>
        <div className="ml-auto flex items-center">


<button className=" bg-[#28DEFC] text-white font-semibold py-1 px-6 mr-5 rounded cursor-pointer" onClick={()=>document.getElementById('my_modal_3').showModal()}>Add</button>
<dialog id="my_modal_3" className="modal">
  <div className="modal-box h-[400px]">
    <form method="dialog" >
      <button className=" hover:text-red-500 absolute right-4 top-2">✕</button>

      <p className="mb-4 mt-4">Name</p>
        <input value={name}
           onChange={(e) => setName(e.target.value)}
          type="text"
          className="form-control text-lowercase shadow-[0_3px_10px_rgb(0,0,0,0.2)] py-2 px-3 w-[100%] focus:outline-none focus:border-none"  />
                          {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}


<p className="mb-4 mt-4">Stock Location</p>   
  <textarea   value={location}
           onChange={(e) => setLocation(e.target.value)}
 
      className="appearance-none h-16 md:h-12  border shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
    ></textarea> 
                    {errors.location && <p className="text-red-500 text-sm">{errors.location[0]}</p>}
                  <div className=' flex text-white justify-end'>
                  <button onClick={handleSave} className="btn justify-end mt-5 bg-[#28DEFC] hover:bg-[#28DEFC] text-white px-6 text-lg"             type="submit" 
            disabled={loading}
        >
            {loading && (
                <FaSpinner className="animate-spin mr-2" /> // Spinner icon
            )}
           <div className=' text-white'>
           {loading ? 'Saving...' : 'Save'} 
           </div>
        </button>
                  </div>

           
    </form>



  </div>
</dialog>
          


        </div>
      </div>

      <div className="mt-4 flex justify-between items-center ">
        {/*  Search Bar Start*/}

        <div className="flex items-center space-x-2">
          <select
            className="rounded border border-[#2B2F67] bg-white shadow-md h-8 w-20 flex items-center justify-center"
            id="paginate_input"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50" selected>
              50
            </option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="400">400</option>
            <option value="500">500</option>
          </select>
         
        </div>

        <form>
          <div className="max-w-xl w-full">
            <div className="flex space-x-4">
              <div className="flex rounded-md  w-full">
                <input
                  type="text"
                  className="w-full border border-gray-300 p-1 rounded-l-md rounded-r-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Search here"
                />

                <button className="bg-[#28DEFC] text-white px-4 py-1 rounded-r-md flex items-center ">
                  <IoIosSearch className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-6">
      <table className="table mb-24">
        {/* Table head */}
        <thead className="text-gray-600 bg-[#EFEFEF]">
          <tr>
            <th className="text-[15px]">SL</th>
            <th className="text-[15px]">Name</th>
            <th className="text-[15px]">Address</th>
            <th className="text-[15px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Table body */}
          {stockLocations.map((location, index) => (
            <tr key={location.id}>
              <th>{index + 1}</th>
              <td>{location.name || "N/A"}</td>
              <td>{location.location || "N/A"}</td>
              <td>
                <div className="dropdown">
                  <button className="text-[20px]">
                    <CiMenuKebab />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                  >
                  
                    <li>
                      <a onClick={() => handleEdit(location)}>
                        <FaRegEdit className="text-green-500 text-[20px] pl-1" />
                        Edit
                      </a>
                    </li>
                    <li>
                      <a onClick={() => handleDelete(location.id)}>
                        <MdDeleteForever className="text-red-500 text-[20px]" />
                        Delete
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {isModalOpen && (
  <form onSubmit={handleEditSave} className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-[999]">
    <div className="bg-white p-5 rounded-md shadow-lg w-[30%] max-w-3xl relative">
      {/* Close Icon */}
      <button
        className="absolute top-3 right-3 text-gray-700 hover:text-red-400"
        onClick={closeModal}
      >
        ✕
      </button>

      <h2 className="text-lg font-bold mb-3">Edit Location</h2>

      {isModalOpen && (
        <div>
          <p className="mb-4 mt-4">Name</p>
          <input
             value={editName}
             onChange={(e) => setEditName(e.target.value)}
            type="text"
            className="form-control text-lowercase shadow-[0_3px_10px_rgb(0,0,0,0.2)] py-2 px-3 w-[100%] focus:outline-none focus:border-none"
          />

          <p className="mb-4 mt-4">Stock Location</p>
          <textarea
            value={editLocation}  onChange={(e) => setEditLocation(e.target.value)}
            className="appearance-none h-16 md:h-12 border shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
          ></textarea>



        </div>
      )}

      <div className="mt-4 flex justify-end">
        {/* <button type='submit'
          className="bg-sky-500 text-white rounded px-4 py-2"
       
        >
          Save
        </button> */}

        <button className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white px-6 text-lg"             type="submit" 
            disabled={loading}
        >
            {loading && (
                <FaSpinner className="animate-spin mr-2" /> // Spinner icon
            )}
            {loading ? 'Saving...' : 'Save'} 
        </button>
      
      </div>
    </div>
  </form>
)}
    </div>

      <div className="join flex justify-center items-center mt-20 mb-10">
        <button className="join-item btn text-sm w-14 h-7 hover:bg-[#28DEFC] hover:text-white">
          «
        </button>
        <button className="join-item btn text-sm w-14 h-7 hover:bg-[#28DEFC] hover:text-white">
          1
        </button>
        <button className="join-item btn text-sm w-14 h-7 hover:bg-[#28DEFC] hover:text-white">
          »
        </button>
      </div>

    </div>
  )
}

export default StockLocation