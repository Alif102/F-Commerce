// CheckOut.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import sampleImg from '../../../assets/package_image.png';
import Swal from 'sweetalert2';
import axios from 'axios';
import { ImSpinner10 } from 'react-icons/im';

const CheckOut = ({ userInfo , onUpdateUserInfo}) => {
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");
  console.log(userInfo)
  const location = useLocation();
  const selectedPackage = location.state?.selectedPackage;
console.log(selectedPackage)
console.log(selectedPackage.id)
const packageId =  selectedPackage.id;
const amount =  selectedPackage.price;
console.log(amount)
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

const handleSave = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("client_id", clientId);
  formData.append("package_id", packageId);
  formData.append("amount", amount);
  

      for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    setLoading(true);
  try {
    const response = await axios.post(
      "https://admin.ezicalc.com/api/package/purchase",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.status) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: response.data.message || "Payment created successfullyyy!",
        showConfirmButton: false,
        timer: 2000,
      });

      navigate("/payment");
      onUpdateUserInfo();
    
     
    } else {
      setErrors(response.data.error || {});
    }
  } catch (error) {
    console.error(
      "Error saving API data:",
      error.response ? error.response.data : error.message
    );
  }finally {
    setLoading(false); 
  }
};
  return (
    <div >
      <div className="w-full shadow py-4 flex pe-4 mb-10
      ">
                <h2 className="px-4 text-xl font-semibold">CheckOut Page</h2>
                
            </div>
            <div className="">
  {selectedPackage ? (
    <div key={selectedPackage.id} className="grid  grid-cols-1 md:grid-cols-12 gap-6 md:gap-16">
      <div className="flex col-span-1 md:col-span-4 px-4 md:px-10 py-24 md:py-8 custom-shadow justify-center">
        <div className="w-full flex justify-center">
          <div className="relative w-[90%] px-4 md:px-4 py-6 bg-white rounded-2xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] text-center">
            <div className="text-4xl md:text-2xl  text-center font-bold text-blue-600">
              <span className="text-3xl md:text-2xl">৳</span>{selectedPackage.price}
            </div>
            <h3 className="my-2 md:my-3 text-lg md:text-xl">{selectedPackage.name}</h3>
            <img src={sampleImg} alt="Package Image" className="w-16 md:w-20 mb-4 md:mb-5 mx-auto" />
            <ul className="p-0">
              <h1 className="my-1 md:my-2 text-sky-600">Business: {selectedPackage.business}</h1>
              <h1 className="my-1 md:my-2 text-sky-600">User: {selectedPackage.user}</h1>
              <h1 className="my-1 md:my-2 text-sky-600">SMS: {selectedPackage.sms}</h1>
              <h1 className={`my-1 md:my-2 ${selectedPackage.product ? 'text-sky-600' : 'text-gray-400'}`}>
                Product: {selectedPackage.product || 'N/A'}
              </h1>
              <h1 className={`my-1 md:my-2 ${selectedPackage.data ? 'text-sky-600' : 'text-gray-400'}`}>
                Data: {selectedPackage.data || 'N/A'}
              </h1>
            </ul>
            <div>
              <button 
                className="mt-4 md:mt-5 btn bg-white rounded-full border border-sky-500 text-sky-500 hover:text-black px-4 py-2"
              >
                Purchase The Plan Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1 md:col-span-7">
        <div className="custom-shadow  p-4 md:p-6 space-y-3">
          <h1 className="font-semibold text-lg md:text-xl">Invoice & Contact Info</h1>
          <h1>Business Name: : {userInfo?.business_name} </h1>
          <h1>Phone Number: : 01710000001</h1>
          <h1>Email: {userInfo?.email}</h1>
          <h1>User Id: {userInfo?.id}</h1>
        </div>
        <div className="custom-shadow p-4  md:p-6 my-4 md:my-5 space-y-3">
          <h1 className="font-bold text-lg md:text-xl">Order Summary</h1>
        
          <h1>Package Name: : {selectedPackage?.name}</h1>
          <h1>Package Price: : {selectedPackage?.price}</h1>
          <hr />
          <h1 className=' font-semibold'>Total: {selectedPackage?.price}</h1>
        </div>
        <div >
          <h1 className="text-lg md:text-xl mb-2">Voucher</h1>
          <div className="flex flex-col gap-2 md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex space-x-3">
              <input type="text" className="input input-bordered w-full hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:max-w-xs" />
              <button className="bg-sky-400 text-white py-2 md:py-3 px-4 md:px-5 rounded-lg">Apply</button>
            </div>
            <button onClick={handleSave} className="bg-sky-400 text-white py-2 md:py-3 px-4 md:px-5 rounded-lg">
            {loading ? (
      <div className='flex justify-center items-center w-full'>
        <ImSpinner10 className='animate-spin text-white' size={20} />
        <span className='px-2 flex items-center'>Applying... 😊</span>
      </div>
    ) : (
      <>
       <h1>Proceed To Apply</h1>
      </>
    )}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>No package selected</p>
  )}
</div>


   
    </div>
  );
};

export default CheckOut;
