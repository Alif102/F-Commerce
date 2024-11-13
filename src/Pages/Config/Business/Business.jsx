import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiMenuKebab } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import toast from "react-hot-toast";
import EditModal from "./EditModal";
import { ImSpinner10 } from "react-icons/im";
import Swal from "sweetalert2";

const Business = () => {
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [email, setEmail] = useState('');
  const [courierDhaka, setCourierDhaka] = useState('');
  const [courierOutsideDhaka, setCourierOutsideDhaka] = useState('');
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({});
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const clientId = localStorage.getItem("clientId");

  const handleImageChange = (event) => {

    
    const file = event.target.files[0];
    setLogo(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const fetchBusinesses = async () => { 
    try {
      const response = await axios.get(`https://admin.ezicalc.com/api/business/index/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const businesses = response.data.data || [];
      setBusinesses(businesses);
  
    } catch (error) {
      console.error('Error fetching businesses:', error.response ? error.response.data : error.message);
    }
  };
  
  
  useEffect(() => {
    fetchBusinesses();
  }, [token, clientId]);
  

console.log(businesses)

  

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('logo', logo);
    formData.append('user_id', userId);
    formData.append('name', businessName);
    formData.append('phone', phoneNumber);
    formData.append('address', businessAddress);
    formData.append('email', email);
    formData.append('inside_dhaka', courierDhaka);
    formData.append('outside_dhaka', courierOutsideDhaka);
    setLoading(true);
    try {
        const response = await axios.post('https://admin.ezicalc.com/api/business/store', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });


        console.log(response.data)
        if (response.data.status) {
            toast.success(response.data.message || 'Business created successfully!', {
                duration: 2000,
                position: 'top-left',
            });

            // Create the new business object based on form data
            const newBusiness = {
                id: response.data.data.id, // Assuming the response contains the new business ID
                logo: response.data.data.logo, // Assuming the response contains the new business logo
                name: businessName,
                phone: phoneNumber,
                address: businessAddress,
                email: email,
                inside_dhaka: courierDhaka,
                outside_dhaka: courierOutsideDhaka,
            };

            // Update businesses state immediately
            setBusinesses(prevBusinesses => [...prevBusinesses, newBusiness]);

            // Reset form fields
            setBusinessName('');
            setPhoneNumber('');
            setBusinessAddress('');
            setEmail('');
            setCourierDhaka('');
            setCourierOutsideDhaka('');
            setImage(null);
            setErrors({});
            document.getElementById('my_modal_6').checked = false;

            // Clear the cache to ensure consistency
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheTimeKey);

        }
        
        if (response.data.message == "Limit exceeded! Please update your package.") {
          toast.error(response.data.message)
  
        }
        if (response.data.error) {
          toast.error(Object.keys(response.data.error).map((field) => ` ${response.data.error[field][0]}`));
  
          const newErrors = response.data.error || {};
          setErrors(newErrors);
          handleErrors(newErrors);
    
        }
    } catch (error) {
        console.error('Error saving business:', error.response ? error.response.data : error.message);
        toast.error('An error occurred while saving the business. Please try again.');
    }finally {
      setLoading(false); 
    }
};



  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleEdit = (business) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };


  const handleDelete = async (id) => {
    // Show a confirmation dialog
    // Prevent deletion for the user with index 2
    const protectedBusinessId = businesses[0]?.id; // Get the ID of the user at index 2
    
    if (id === protectedBusinessId) {
      Swal.fire('Error!', 'You cannot delete this Business.', 'error');
      return; // Exit the function early
    }
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
        const response = await axios.delete(`https://admin.ezicalc.com/api/business/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data.status) {
          Swal.fire('Deleted!', response.data.message || 'Businessssss deleted successfullyyy.');
  
          // Remove the deleted SMS from the state
          setBusinesses((prevSms) => prevSms.filter((sms) => sms.id !== id));
        } else {
          Swal.fire('Error!', response.data.message || 'Failed to delete SMS.', 'error');
        }
      } catch (error) {
        console.error('Error deleting SMS:', error.response ? error.response.data : error.message);
        Swal.fire('Error!', 'Failed to delete SMS.', 'error');
      }
    }
  };


console.log(businesses)
  return (
    <div className="mx-4 md:mx-10">
      <div className="w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 ">
        <h2 className="px-4 text-xl font-semibold">Add Business</h2>
        <div className="ml-auto flex items-center">
          <label
            htmlFor="my_modal_6"
            className="bg-[#28DEFC] text-white font-semibold py-1 px-6 mr-5 rounded cursor-pointer"
          >
            Add New
          </label>

          <input type="checkbox" id="my_modal_6" className="modal-toggle" />
          <div className="modal" role="dialog">
            <div className="modal-box">
              <div className="flex justify-between font-bold pb-3 px-2">
                <p className="text-2xl">Add Business</p>
                <label htmlFor="my_modal_6" className="text-3xl cursor-pointer">
                  <IoClose />
                </label>
              </div>

              <form onSubmit={handleSave}>
                <div className="w-full max-w-md mx-auto mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Business Name</label>
                  <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 ease-in-out ${errors.name ? '' : ''}`}
                    id="Businessname"
                    type="text"
                    placeholder="Enter your Business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
                </div>

                <div className="w-full max-w-md mx-auto mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Business Address</label>
                  <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 ease-in-out ${errors.address ? '' : ''}`}
                    id="Businesslocation"
                    type="text"
                    placeholder="Enter your Business Location"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address[0]}</p>}
                </div>

                <div className="w-full max-w-md mx-auto mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                  <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 ease-in-out ${errors.phone ? '' : ''}`}
                    id="Businessnumber"
                    type="number"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone[0]}</p>}
                </div>

                <div className="w-full max-w-md mx-auto mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 ease-in-out ${errors.email ? '' : ''}`}
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
                </div>

                <div className="flex justify-between mx-2 mb-4">
                  <div className="w-1/2 max-w-md mr-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Courier Cost Inside Dhaka</label>
                    <input
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 ease-in-out ${errors.inside_dhaka ? '' : ''}`}
                      id="courierDhaka"
                      type="text"
                      placeholder="Inside Dhaka"
                      value={courierDhaka}
                      onChange={(e) => setCourierDhaka(e.target.value)}
                    />
                    {errors.inside_dhaka && <p className="text-red-500 text-sm">{errors.inside_dhaka[0]}</p>}
                  </div>
                  <div className="w-1/2 max-w-md ml-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Courier Cost Outside Dhaka</label>
                    <input
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition duration-150 ease-in-out ${errors.outside_dhaka ? '' : ''}`}
                      id="courierOutsideDhaka"
                      type="text"
                      placeholder="Outside Dhaka"
                      value={courierOutsideDhaka}
                      onChange={(e) => setCourierOutsideDhaka(e.target.value)}
                    />
                    {errors.outside_dhaka && <p className="text-red-500 text-sm">{errors.outside_dhaka[0]}</p>}
                  </div>
                </div>




                <div className="w-full max-w-md ml-2">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Business Logo
      </label>
      <div className="rounded-lg border border-gray-400 bg-white shadow-lg">
        <div className="my-4 mx-4 h-full bg-white flex flex-col items-center justify-center">
          <label
            htmlFor="logo"
            className="relative flex flex-col items-center cursor-pointer"
          >
            {image ? (
              <img
                src={image}
                alt="Uploaded Logo"
                className="mb-2 w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="70"
                height="70"
                viewBox="0 0 80 80"
                fill="none"
                className="mb-2"
              >
                <circle cx="40" cy="40" r="40" fill="#D9D9D9" />
                <line
                  x1="20"
                  y1="40"
                  x2="60"
                  y2="40"
                  stroke="white"
                  strokeWidth="4"
                />
                <line
                  x1="40"
                  y1="20"
                  x2="40"
                  y2="60"
                  stroke="white"
                  strokeWidth="4"
                />
              </svg>
            )}
                  <input
          type="file"
          id="logo"
          className="opacity-0 absolute z-[-1] w-full h-full cursor-pointer"
          onChange={handleImageChange}
         
        />
            <div className="mt-2 text-center">
              {image ? "Change Logo" : "Add Logo"}
            </div>
          </label>
        </div>
      </div>
    </div>
    {errors.logo && <p className="text-red-500 mx-3 text-sm">{errors.logo[0]}</p>}







                <div className="modal-action">
                  <label htmlFor="my_modal_6" className="btn">Close</label>
                  <button
    type="submit"
   className="btn bg-sky-400 text-white"

  >
    {loading ? (
      <div className='flex justify-center items-center w-full'>
        <ImSpinner10 className='animate-spin text-white' size={20} />
        <span className='px-2'>Saving...</span>
      </div>
    ) : (
      <>
       <h1  className=" bg-sky-400 text-white ">Save</h1>
      </>
    )}
  </button>
                </div>
              </form>
            </div>
            <label htmlFor="my_modal_6" className="modal-backdrop"></label>
          </div>
        </div>
      </div>


      {/* <div className="mt-4 flex justify-between items-center px-4">
    

        <select
  className="text-center rounded border border-blue-500 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-md h-8 w-20 flex items-center justify-center"
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


        <form>
          <div className="max-w-xl w-full">
            <div className="flex space-x-4">
              <div className="flex items-center rounded-md  w-full">
                <input
                  type="text"
                  className="w-full h-8 border border-gray-300 p-1 rounded-l-md rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search here"
                />

                <button className="bg-[#28DEFC] hover:bg-blue-600 text-white px-4 py-1 rounded-r-md flex items-center">
                  <IoIosSearch className="w-6 h-7" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div> */}

      {/* Table */}
      <div className=" overflow-x-auto my-6">
      <table className="table w-full mb-28">
        <thead className="text-gray-600 bg-[#EFEFEF]">
          <tr>
            <th className="text-[15px]">SL</th>
            <th className="text-[15px]">Logo</th>
            <th className="text-[15px]">Name</th>
            <th className="text-[15px]">Location</th>
            <th className="text-[15px]">Phone Number</th>
            <th className="text-[15px]">Email</th>
            <th className="text-[15px]">Courier Charge</th>
            <th className="text-[15px]">Action</th>
          </tr>
        </thead>
        <tbody className=" divide-y divide-gray-200 overflow-y-hidden h-auto">
        {businesses.length > 0 ? (
          businesses.map((business, index) => (
            <tr key={business.id} className="hover:bg-gray-100 text-sky-800">
              <td className="text-[15px] whitespace-nowrap">{index + 1}</td>
              <td className="whitespace-nowrap">
                <img src={`https://admin.ezicalc.com/public/storage/business/logo/${business.logo}`} alt="Logo" className="h-8 w-8" />
              </td>
              <td className="text-[15px] whitespace-nowrap">{business.name}</td>
              <td className="text-[15px] whitespace-nowrap">{business.address}</td>
              <td className="text-[15px] whitespace-nowrap">{business.phone}</td>
              <td className="text-[15px] whitespace-nowrap">{business.email}</td>
              <td className="text-[15px] whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="flex">Inside: <span className="ml-1">{business.inside_dhaka} BDT</span></div>
                  <div className="flex">Outside: <span className="ml-1">{business.outside_dhaka} BDT</span></div>
                </div>
              </td>
              <td className="whitespace-nowrap ">
                <div className="dropdown dropdown-end z-auto">
                  <button className="text-[20px]  text-gray-600 hover:text-gray-800">
                    <CiMenuKebab />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg "
                  >
                    <li>
                      <a onClick={() => handleEdit(business)}>
                        <FaRegEdit className="text-green-500 text-[20px] pl-1" />Edit
                      </a>
                    </li>
                    <li>
                      <a onClick={() => handleDelete(business.id)}>
                        <MdDeleteForever className="text-red-500 text-[20px]" />Delete
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center p-4">
            <span className="loading loading-ring loading-md"></span>
            </td>
          </tr>
        )}
        </tbody>
      </table>

      {/* Modal Component */}
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        business={selectedBusiness}
        onSave={fetchBusinesses}
      />
    </div>

    </div>
  );
};

export default Business;