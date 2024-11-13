import  { useState ,useEffect} from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ImSpinner10 } from "react-icons/im";
import FraudInput from '../../../../Pages/Order/FraudInput';
const Data = ({handleErrors ,businessId}) => {


  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const clientId = localStorage.getItem("clientId");

  const [error, setError] = useState(null);

  const [customerName, setCustomerName] = useState('');


  const [phoneNumber, setPhoneNumber] = useState('');

  const [source, setSource] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
  
 
   
  
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('user_id', userId);
    formData.append('business_id', businessId);
    formData.append('c_name', customerName);
    formData.append('c_phone', phoneNumber);
    formData.append('source', source);
  
    formData.append('address', address);
  
  
    setLoading(true); // Start loading
    try {
      const response = await axios.post('https://admin.ezicalc.com/api/order/data', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.data.status) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: response.data.message || "Order created successfully!",
          showConfirmButton: false,
          timer: 2000
        });

        localStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheTimeKey);
  
        // Reset form fields
        setCustomerName('');
        setPhoneNumber('');
   
        setAddress('');
       
        setSource('');
      
        setErrors({});
      
        removeAllProducts();
        handleErrors('');
      }
      
    //  else if (response.data.type === 'invalid') {
    //     toast.error(response.data.message);
    //   }
    if (response.data.message == "Limit exceeded! Please update your package.") {
      toast.error(response.data.message)

    }
    if (response.data.error) {
      toast.error(Object.keys(response.data.error).map((field) => ` ${response.data.error[field][0]}`));

      const newErrors = response.data.error || {};
      setErrors(newErrors);
      handleErrors(newErrors);

    }
      
      else {


        const newErrors = response.data.error || {};
        setErrors(newErrors);
        handleErrors(newErrors);

        toast.error(Object.keys(response.data.error).map((field) => ` ${response.data.error[field][0]}`));


      }
    } catch (error) {
      console.error('Error saving Order:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false); // Stop loading after completion or error
    }
  };

  const [existCustomer, setExistCustomer] = useState(null);
  const [value, setValue] = useState('');
  const [fraudData, setFraudData] = useState(null);

  const handleFraudInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleDataReceived = (data) => {
    setFraudData(data);
  };

  const existingCustomer = async (phone) => {
    if (phone.length < 11) {
      setExistCustomer(null);
      return;
    }
    setLoading(true); // Set loading to true when starting the fetch
    try {
      const response = await axios.get(`https://admin.ezicalc.com/api/existing/customer/${clientId}-${phone}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setExistCustomer(response.data);
      console.log(response);

      // If the response contains customer data, update customerName
      if (response.data.status && response.data.data) {
        setCustomerName(response.data.data.c_name); 
        setAddress(response.data.data.address);
        setSource(response.data.data.source);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Set loading to false after the fetch
    }
  };
// console.log(existCustomer)

  return (
    <div className="w-full mx-auto py-3 ">
      <form onSubmit={handleSave}  className="space-y-4">
      <div className='flex gap-3  md:flex-row'>


{/* phone */}
<div className=' flex-1'>


  <label htmlFor="phone" className="block  text-[14px] md:text-[16px] font-semibold  text-gray-600 dark:text-white">Customer Phone</label>

  {/* <input type="text" id="first_name" className="bg-white
hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] h-8
  text-[14px] md:text-[16px] font-semibold rounded-lg w-full p-1"
    value={phoneNumber}  onChange={(e) => setPhoneNumber(e.target.value)}
  /> */}
  <FraudInput 
          value={phoneNumber} 
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            existingCustomer(e.target.value);
            handleFraudInputChange();
          }} onDataReceived={handleDataReceived}
          
        />
                {errors.c_phone && <p className="text-red-500 text-sm">{errors.c_phone[0]}</p>}



</div>





<div className=' flex-1'>
  <label htmlFor="first_name" className="block  text-[14px] md:text-[16px] font-semibold  text-gray-600 dark:text-white">Customer name</label>

  <input 
  value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
   type="text" id="first_name" className="bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-[14px] md:text-[16px]  rounded-lg w-full p-1" />
                 {errors.c_name && <p className="text-red-500 text-sm">{errors.c_name[0]}</p>}

</div>


</div>
{phoneNumber.length === 11 && fraudData && (
  <ul className="w-full bg-white border border-gray-300 rounded-lg shadow-md mt-2 py-2 px-3">
    <div className=' w-[100%] mx-auto'>
              <div className=" flex justify-between">
              <h1 className="text-xs mb-2">
          SteadFast Total Parcels = {fraudData.total_parcels} Pis
        </h1>
                <h1 className="text-sm font-medium">
                {`${fraudData.total_parcels > 0 ? ((fraudData.total_delivered / fraudData.total_parcels) * 100).toFixed(2) : "0.00"}%`}
                </h1>
              

              </div>
           
              <div className="w-full bg-gray-200 rounded-full h-2.5">

                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${fraudData.total_parcels > 0 ? ((fraudData.total_delivered / fraudData.total_parcels) * 100).toFixed(2) : 0}%` }} // Corrected here
                ></div>
                </div>
              </div>
  </ul>
)}
        <div>
        <label htmlFor="first_name" className="block  text-[14px] md:text-[16px] font-semibold  text-gray-600 dark:text-white">Address</label>
        <textarea  value={address}
  onChange={(e) => setAddress(e.target.value)}
      className="appearance-none h-16 md:h-12  border hover:border-blue-500  focus:ring-2 focus:ring-blue-500 shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
    ></textarea> 
            {errors.address && <p className="text-red-500 text-sm">{errors.address[0]}</p>}
        </div>
        <div className="flex-1 mx-auto">
              <h2 className='block  text-[14px] md:text-[16px] font-semibold  text-gray-600 dark:text-white'>Source </h2>
              <select
 
  className="border h-9 border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px]  text-gray-900 text-[14px] md:text-[16px] rounded-lg   block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  value={source}
  onChange={(e) => setSource(e.target.value)}
>

<option value="" disabled>select source</option>

  <option value="facebook">facebook</option>
  <option value="instagram">instagram</option>
  <option value="whatsApp">whatsApp</option>
  <option value="phone_call">phone call</option>
</select>
{errors.source && <p className="text-red-500 text-sm">{errors.source[0]}</p>}


            </div>
        {/* <button
          type="submit"
          className="w-full py-2 px-4 bg-[#28DEFC] text-white font-semibold rounded-md shadow-md hover:bg-sky-500 focus:ring focus:ring-indigo-200"
        >
          Save
        </button> */}

<button
    type="submit"
    className="w-full rounded-lg px-2 py-3 text-white bg-[#28DEFC] hover:bg-[#444CB4] "
    disabled={loading} // Disable button while loading

  >
    {loading ? (
      <div className='flex justify-center w-full'>
        <ImSpinner10 className='animate-spin text-white' size={20} />
        <span className='px-2'>Saving.......</span>
      </div>
    ) : (
      <>
        <h1 cclassName="w-full py-2 px-4 bg-[#28DEFC] text-white font-semibold rounded-md shadow-md hover:bg-sky-500 focus:ring focus:ring-indigo-200">Save</h1>
        
      </>
    )}
  </button>
      </form>
    </div>
  );
};

export default Data;
