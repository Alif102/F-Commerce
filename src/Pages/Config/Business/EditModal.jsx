import React, { useRef, useState , useEffect} from 'react';
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { ImSpinner10 } from 'react-icons/im';


const EditModal = ({ isOpen, onClose, business, onSave }) => {
  if (!isOpen) return null;



  
 
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);


  const [logo, setLogo] = useState(null);
  const token = localStorage.getItem("token");

  const clientId = localStorage.getItem("clientId");
  const userId = localStorage.getItem("userId");

  const [businessName, setBusinessName] = useState('');
  const [businessId, setBusinessId] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [email, setEmail] = useState('');
  const [courierDhaka, setCourierDhaka] = useState('');
  const [courierOutsideDhaka, setCourierOutsideDhaka] = useState('');

  const [loading, setLoading] = useState(false);






  console.log(business);


  useEffect(() => {
    if (business) {
      setBusinessName(business.name);
      setPhoneNumber(business.phone);
      setBusinessAddress(business.address);
      setEmail(business.email);
      setCourierDhaka(business.inside_dhaka);
      setCourierOutsideDhaka(business.outside_dhaka);
      setBusinessId(business.id);
      
    }
  }, [business]);









  const [errors, setErrors] = useState({});
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
  
    // Append the form fields
    formData.append('business_id', businessId);
    formData.append('client_id', clientId);
    formData.append('user_id', userId);
    formData.append('name', businessName);
    formData.append('phone', phoneNumber);
    formData.append('address', businessAddress);
    formData.append('email', email);
    formData.append('inside_dhaka', courierDhaka);
    formData.append('outside_dhaka', courierOutsideDhaka);


  
    if (logo) {
      formData.append('logo', logo);
    }

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    setLoading(true); 
    try {
      const response = await axios.post('https://admin.ezicalc.com/api/business/update', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.status) {
        toast.success(response.data.message || 'Business updated successfully!', {
          duration: 2000,
          position: 'top-middle',
        });
  
        // Reset form state
        setBusinessName('');
        setPhoneNumber('');
        setBusinessAddress('');
        setEmail('');
        setCourierDhaka('');
        setCourierOutsideDhaka('');
        setImage(null);
        setErrors({});
  
        // Trigger the onSave callback to refresh the parent data
        onSave(); 
  
        // Close the modal
        onClose();
      } else {
        setErrors(response.data.error || {});
      }
    } catch (error) {
      console.error('Error updating business:', error);
    } finally {
      setLoading(false); 
    }
  };
  
  
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

 

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file); // Add this line to check the selected file
    setLogo(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);

        setUpdateImage(file);

      };
      reader.readAsDataURL(file);
    }
  };
  

  return (

<div className="fixed inset-0 flex items-center justify-center z-50">
  <div className="modal modal-open">
    <div className="modal-box space-y-2 relative">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold">Edit Business</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <IoClose size={26} />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="text-gray-700  text-sm font-bold">Name:</label>
          <input
            type="text"
            name="name"
            value={businessName}   onChange={(e) => setBusinessName(e.target.value)}
            className="input input-bordered  w-full mb-2 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-gray-700 text-sm font-bold mb-2">Address:</label>
          <input
            type="text"
            name="address"
            defaultValue={businessAddress}  onChange={(e) => setBusinessAddress(e.target.value)}
            className="input input-bordered hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-2"
          />
        </div>
        <div>
          <label className="text-gray-700 text-sm font-bold mb-2">Phone:</label>
          <input
            type="number"
            name="phone"
           value={phoneNumber}   onChange={(e) => setPhoneNumber(e.target.value)}
            className="input input-bordered hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-2"
          />
        </div>
        <div>
          <label className="text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-2"
          />
        </div>
        <div className="flex gap-3">
          <div>
            <label className="text-gray-700 text-sm font-bold mb-2">
              Courier Charge Inside Dhaka:
            </label>
            <input
              type="number"
              name="inside_dhaka"
              value={courierDhaka} onChange={(e) => setCourierDhaka(e.target.value)}
              className="input input-bordered hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-2"
            />
          </div>
          <div>
            <label className="text-gray-700 text-sm font-bold mb-2">
              Courier Charge Outside Dhaka:
            </label>
            <input
              type="number"
              name="outside_dhaka"
              value={courierOutsideDhaka}
                      onChange={(e) => setCourierOutsideDhaka(e.target.value)}
              className="input input-bordered hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Business Logo</label>
          <button
            onClick={handleButtonClick} 
            type="button"
            className="rounded w-full border border-gray-400 bg-white flex flex-col items-center cursor-pointer shadow-[0_3px_10px_rgb(0,0,0,0.2)] py-3"
          >
            <div className="relative">
              {image ? (
                <img
                  src={image}
                  alt="Selected"
                  className="w-20 h-20 object-cover rounded-full"
                />
              ) : business.logo ? (
                <img
                  src={`https://admin.ezicalc.com/public/storage/business/logo/${business.logo}`}
                  alt="Current"
                  className="w-20 h-20 object-cover rounded-full"
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
                  <line x1="20" y1="40" x2="60" y2="40" stroke="white" strokeWidth="4" />
                  <line x1="40" y1="20" x2="40" y2="60" stroke="white" strokeWidth="4" />
                </svg>
              )}
            </div>
            <div className="mt-2 text-center">Add Image</div>
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="modal-action">
          <label onClick={onClose} className="btn">Close</label>
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
</div>



  );
};

export default EditModal;
