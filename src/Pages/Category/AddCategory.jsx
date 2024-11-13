import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import { ImSpinner10 } from "react-icons/im";
import { LuImagePlus } from "react-icons/lu";



const AddCategory = () => {


  const [items, setItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(''); 
  const [name, setName] = useState(''); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/items.json');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);




  const handleSelect = (id) => {
    const selectedItem = items.find((item) => item.id === id);
    setSelectedImage(selectedItem.imageUrl); // Update selected image URL
  };
  

  const [businesses, setBusinesses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);


  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Toggle the selected state

  

  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const clientId = localStorage.getItem("clientId");
  const [selectedOptions, setSelectedOptions] = useState([]);


 

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get(`https://admin.ezicalc.com/api/business/index/${clientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.data.status) {
          setBusinesses(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };
    fetchBusinesses();
  }, [token, clientId]);

 
  const options = businesses.map((business) => ({
    value: business.id,
    label: business.name,
  }));

  const allOption = { value: 'all', label: 'All Business' };

  const allOptions = [allOption, ...options];

  const handleChange = (selected) => {
    if (selected.some(option => option.value === 'all')) {
      setSelectedOptions(options);
      console.log(options.map(option => option.value)); // Log all business IDs
    } else {
      setSelectedOptions(selected);
      console.log(selected.map(option => option.value)); // Log selected business IDs
    }
  };
  






  const [errors, setErrors] = useState({});


  const cacheKey = `categories_${clientId}`;
  const cacheTimeKey = `categories_${clientId}_timestamp`;
 
  const handleSave = async (e) => {
    e.preventDefault();
  
    const selectedArray = selectedOptions.map(option => ({
      value: option.value,
      name: option.label,
    }));
  
    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("user_id", userId);
    formData.append("name", name);
    formData.append("image", selectedImage);
  
    const businessIds = selectedArray.map(item => item.value).join(',');
    formData.append("business_ids", businessIds);
  
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`); 
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://admin.ezicalc.com/api/category/store",
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
          response.data.message || "Category created successfully!",
          {
            duration: 2000,
            position: "top-right",
          }
        );
  
        // Reset form fields
        setErrors({});

           localStorage.removeItem(cacheKey);
         localStorage.removeItem(cacheTimeKey);
         navigate("/category");
      } else {
        setErrors(response.data.error || {});
      }
    } catch (error) {
      console.error(
        "Error saving categories:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        "An error occurred while saving the business. Please try again."
      );
    }finally {
      setLoading(false); 
    }
  };
  
  


  return (
    <div className="mx-4 md:mx-10">
      <div className="mb-5 w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 justify-between">
        <h2 className="px-4 text-xl font-semibold">Category</h2>

     <div className="w-auto">

     <Select
          options={allOptions} 
          isMulti
          onChange={handleChange}
          value={selectedOptions} 
          placeholder="Select businesses..."
        />
             {errors.business_ids && <p className="text-red-500 text-sm">{errors.business_ids[0]}</p>}

             

     </div>
      </div>


      <form onSubmit={handleSave} className="rounded-md shadow-sm border border-gray-300 h-96 mt-5 px-5 pt-5 ">
        <p className="mb-4">Category Name</p>
        <input
          type="text"
          className="form-control text-lowercase shadow-sm border border-gray-300 rounded-md py-2 px-3 w-[50%] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter category name"

          value={name}
          onChange={(e) => setName(e.target.value)}
        />

           {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}


        <p className="mb-4 mt-5">Image</p>
        <div className="flex items-center">
        <div className="relative z-40 w-[50%]">
        <button type="button"
          onClick={toggleDrawer}
          className="rounded-md w-full flex flex-col items-center cursor-pointer shadow-sm border border-gray-300 py-3"
        >
          <div className="relative">
            {selectedImage ? (
              <img src={selectedImage} alt="Selected" className="w-20 h-20 object-cover rounded-full" />
            ) : (
              <LuImagePlus className="w-10 h-10" />


            )}
          </div>

          <div className="mt-2 text-center">Add Image</div>
        </button>

        {errors.image && <p className="text-red-500 text-sm">{errors.image[0]}</p>}



        {/* Bottom Drawer */}
        <div
          className={`fixed inset-x-0 bottom-0 bg-white shadow-lg transition-transform transform h-[90%] ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="overflow-auto">
              {/* Search Bar */}
              <div className="px-4 my-4 w-full text-lg font-semibold bg-gray-100 h-16 flex items-center shadow-md rounded-lg">
                <p className="text-gray-800">Previously uploaded files</p>

                <div className="flex justify-end items-center ml-auto gap-5">
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-l-md py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search for..."
                    />
                    <button className="bg-[#28DEFC] text-white rounded-r-md py-2 px-4 transition duration-200 hover:bg-[#28DEFC]">
                      Search
                    </button>
                  </div>

                  <button type="button"
                    className="mr-4 text-[30px] cursor-pointer hover:text-[#28DEFC]"
                    onClick={toggleDrawer} // Close the drawer when clicked
                    aria-label="Close"
                  >
                    <IoClose />
                  </button>
                </div>
              </div>

              {/* Second Set of Image Thumbnails */}
              <div className="flex mb-3 justify-between">
                <div className="flex flex-wrap gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex flex-col items-center">
                      <div
                        className={`relative flex items-center justify-center text-white w-40 h-40 cursor-pointer ${
                          selectedImage === item.imageUrl ? "border-2 border-blue-500" : ""
                        }`}
                        onClick={() => handleSelect(item.id)}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedImage === item.imageUrl && (
                          <div className="absolute top-0 right-0 p-2">
                            <FaCheck className="text-green-800" />
                          </div>
                        )}
                      </div>
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex-grow flex items-end justify-center">
              <button type="button"
                onClick={toggleDrawer}
                className="bg-[#28DEFC] text-white px-4 py-2 rounded w-80"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>



        <div className="flex justify-end">
          
            {/* <button type="submit"  className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white px-6 text-lg">
              Saveeee
            </button> */}

            <button
    type="submit"
  className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white px-6 text-lg"

  >
    {loading ? (
      <div className='flex justify-center items-center w-full'>
        <ImSpinner10 className='animate-spin text-white' size={20} />
        <span className='px-2'>Saving...</span>
      </div>
    ) : (
      <>
       <h1>Save</h1>
      </>
    )}
  </button>
          
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
