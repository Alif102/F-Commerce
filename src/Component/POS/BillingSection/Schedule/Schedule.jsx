import { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ImSpinner10 } from "react-icons/im";
import FraudInput from '../../../../Pages/Order/FraudInput';

const Schedule = ({ totalPrice, singleQuantity, selectedBusiness, variationQuantity, removeAllProducts, businessId, productStock, productVariations, handleErrors }) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const clientId = localStorage.getItem("clientId");

  const [inputValue, setInputValue] = useState('');
  const [advance, setAdvance] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('%');
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const dropdownRef = useRef(null);
  const business_Id =  businessId?.id;

  const [deliveryCharge, setDeliveryCharge] = useState('');
  const [subtotal, setSubtotal] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [courier, setCourier] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [note, setNote] = useState('');
  const [sms, setSms] = useState('');
  const [source, setSource] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  
  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setDeliveryCharge(value);
  };

  const deliveryChargeNum = Number(deliveryCharge) || 0;
  const totalPriceNum = Number(totalPrice) || 0;
  const advanceNum = Number(advance) || 0;

  useEffect(() => {
    let discountAmount = 0;

    if (inputValue) {
      if (selectedOption === '%') {
        discountAmount = (totalPriceNum * parseFloat(inputValue)) / 100;
      } else if (selectedOption === 'Fixed') {
        discountAmount = parseFloat(inputValue);
      }
    }

    const newSubtotal = totalPriceNum + deliveryChargeNum - discountAmount;
    setSubtotal(newSubtotal);
  }, [inputValue, selectedOption, totalPriceNum, deliveryChargeNum]);

  const dueAmount = subtotal - advanceNum;

  const cacheKey = `orders_${clientId}`;
  const cacheTimeKey = `orders_${clientId}_timestamp`;

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [isTargetAudience, setIsTargetAudience] = useState(false); // Initial state for toggle
  const handleToggleChange = () => {
    setIsTargetAudience(!isTargetAudience); // Toggle state
  };
  const handleSave = async (e) => {
    e.preventDefault();

    if (totalPrice === 0) {
      Swal.fire({
        position: "top-end",
        icon: 'warning',
        title: 'Please select a Product',
        showConfirmButton: true,
        timer: 2000
      });
      return;
    }
    if (Array.isArray(productStock) && productStock.length === 1 && productStock[0] === 0) {
      Swal.fire({
        position: "top-end",
        timer: 2000,
        icon: 'warning',
        title: 'Product Stock is Empty',
        showConfirmButton: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('user_id', userId);
    formData.append('business_id', business_Id);
    formData.append('product_ids', productVariations);
    formData.append('s_product_qty', singleQuantity);
    formData.append('v_product_qty', variationQuantity);
    formData.append('c_name', customerName);
    formData.append('c_phone', phoneNumber);
    formData.append('note', note);
    formData.append('source', source);
    formData.append('courier', courier);

    formData.append('payment_date', paymentDate);
    formData.append('sms_text', sms);
    formData.append('address', address);
    formData.append('created_by', userId);
    formData.append('advance', advance);
    formData.append('discount_amount', inputValue);
    formData.append('delivery_charge', deliveryCharge);
    formData.append('cod_amount', dueAmount);

    // Append the is_target_audience based on the toggle state
    formData.append('is_target_audience', isTargetAudience ? 1 : 0);

    setLoading(true); // Start loading
    try {
      const response = await axios.post('https://admin.ezicalc.com/api/order/schedule/create', formData, {
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
        setCourier('');
        setAddress('');
        setNote('');
        setSource('');
        setPaymentDate('');
        setSms('');
        setAdvance('');
        setErrors({});
        setDeliveryCharge('');
        removeAllProducts();
        handleErrors('');
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
        const newErrors = response.data.error || {};
        setErrors(newErrors);
        handleErrors(newErrors);

        toast.error(Object.keys(response.data.error).map((field) => ` ${response.data.error[field][0]}`));
      }
    } catch (error) {
      console.error('Error saving Order:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };
  const [value, setValue] = useState('');
  const [fraudData, setFraudData] = useState(null);
  const handleFraudInputChange = (e) => {
    setValue(e.target.value);
  };
   const handleDataReceived = (data) => {
    setFraudData(data);
  };

  const [existCustomer, setExistCustomer] = useState(null);


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
    <form className=""  onSubmit={handleSave}>
      <div className='flex gap-3 '>


        <div className=' flex-1'>


          <label htmlFor="phone" className="block  text-[14px] md:text-[16px] font-semibold  text-gray-600 dark:text-white">Customer Phone</label>

        
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
          <label htmlFor="first_name" className="block  text-[14px] md:text-[16px] font-semibold  text-gray-600 dark:text-white">Customer  Name</label>

          <input value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            type="text" id="first_name" className="bg-white shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500  text-[14px] md:text-[16px]  rounded-lg w-full p-1" />
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

      <div className='flex gap-2 flex-wrap'>

        <div className=" flex-1">
          <h2 className='block  text-[14px] md:text-[16px] font-semibold  text-gray-600 dark:text-white'>Source </h2>
          <select

            className="border h-9 border-gray-300 shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full  text-gray-900 text-[14px] md:text-[16px] rounded-lg "
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



        {/* payment_date */}

        <div className=' flex-1'>
          <h2 className='block  text-[14px] md:text-[16px] font-semibold  text-gray-600 dark:text-white'>Payment Date</h2>

          <input
  type="date"
  value={paymentDate}
  onChange={(e) => setPaymentDate(e.target.value)}
  onClick={(e) => e.target.showPicker()} // Handle the click event inline
  className="
    bg-white shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] 
    w-full md:text-[16px] rounded-lg p-1
  "
/>

        {errors.payment_date && <p className="text-red-500 text-sm">{errors.payment_date[0]}</p>}

        </div>
      </div>



      <div className="flex flex-row items-center justify-between ">


      <div className="form-control">
        <label className="label gap-1 cursor-pointer">
          <span className="label-text">Targeted Audience</span>
          <input
            type="checkbox"
            className="toggle toggle-info scale-75"
            checked={isTargetAudience}
            onChange={handleToggleChange}
          />
        </label>
      </div>

        <div className="form-control">
          <label className="label gap-1 cursor-pointer">
            <span className="label-text">Add Note</span>
            <input
              type="checkbox"
              className="toggle toggle-info scale-75"
              checked={isNoteVisible}
              onChange={() => setIsNoteVisible(!isNoteVisible)}
            />
          </label>
        </div>


      </div>

      <div className="flex md:flex-col flex-row gap-3">
        <div className="flex-1">
          {/*note  */}
          {isNoteVisible && (
           
            
        <div className=" ">
        <label className="text-[14px] md:text-[16px] font-semibold text-gray-600 dark:text-white">Note</label>
        <textarea
           value={note}
           onChange={(e) => setNote(e.target.value)}
          className=" h-8 md:h-auto border shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500  focus:ring-2 focus:ring-blue-500 rounded w-full px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
{errors.note && <p className="text-red-500 text-sm">{errors.note[0]}</p>}
      </div>
          )}


          <div className=" ">
            <label className="block text-[14px] md:text-[16px] font-semibold text-gray-600">Address</label>
               {/* address */}
          <textarea  value={address}
  onChange={(e) => setAddress(e.target.value)}
      className="appearance-none h-16 md:h-12  border shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500  focus:ring-2 focus:ring-blue-500 rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
    ></textarea> 

          {errors.address && <p className="text-red-500 text-sm">{errors.address[0]}</p>}

          </div>


       


        {/* sms text  */}

        <div className=" ">
          <label className="text-[14px] md:text-[16px] font-semibold text-gray-600 dark:text-white">SMS Text</label>
          <textarea
             value={sms}
             onChange={(e) => setSms(e.target.value)}
            className=" h-8 md:h-auto border shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500  focus:ring-2 focus:ring-blue-500 rounded w-full px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
          {errors.sms_text && <p className="text-red-500 text-sm">{errors.sms_text[0]}</p>}

        </div>





        </div>


      
     
         
      </div>

      <div className="">
              <h2 className='block  text-[14px] md:text-[16px] font-semibold  text-gray-600 dark:text-white'>Courier </h2>
              <select
 
  className="border h-9 border-gray-300 shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500  text-gray-900 text-[14px] md:text-[16px] rounded-lg   block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  value={courier}
  onChange={(e) => setCourier(e.target.value)}
>
<option value="">select courier</option>
  <option value="redx">RedX</option>
  <option value="steadfast">Steed Fast</option>
  <option value="sundarban">Sunderban</option>
  <option value="SA-paribahan">SA-Paribahan</option>
  <option value="office-delivery">Office Delivery</option>
</select>
{errors.courier && <p className="text-red-500 text-sm">{errors.courier[0]}</p>}


            </div>
      


      <div className=''>


        <div className='  '>

          <div className='flex justify-between items-center'>
            <h2 className='block   text-[15px]  font-semibold whitespace-nowrap  text-gray-600 dark:text-white'>Advanced Paid </h2>
            <div className='flex justify-end '>
              <div className="form-control">
                <label className="label gap-1 cursor-pointer">
                  <span className="label-text whitespace-nowrap">Full Paid</span>
                  <input type="checkbox" className="toggle toggle-info scale-75 " />
                </label>
              </div>
            </div>

          </div>


          <div className=' flex  justify-between lg:flex-row gap-3 '>


            <div className="flex  items-center">

              <input
                type="number"
                value={advance}
                onChange={(e) => setAdvance(e.target.value)}
                className="w-full border shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-8 pl-2 border-gray-300 rounded-l-md"
              />
              {errors.advance && <p className="text-red-500 text-sm">{errors.advance[0]}</p>}


              <button
                className="px-2  h-8 bg-[#28DEFC] text-white rounded-r-md hover:bg-blue-600 "
              >
                ৳
              </button>
            </div>

            <div className='  '>


              <div className="relative w-full" ref={dropdownRef}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="px-1 pl-2 shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 input input-bordered w-full h-8"
                  placeholder="Discount"
                />

                {errors.discount_amount && <p className="text-red-500 text-sm">{errors.discount_amount[0]}</p>}

                <button
                  className="rounded-lg bg-[#28DEFC] text-white absolute right-0 top-0 rounded-l-none h-8"
                  onClick={toggleDropdown}
                >
                  <div className="flex items-center px-2 gap-2">
                    <h1>{selectedOption}</h1>
                    {/* <FaSortAmountDown /> */}
                  </div>
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-content absolute right-0 w-36 bg-white border border-gray-300 rounded shadow-lg">
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800"
                      onClick={() => handleOptionClick('Fixed')}
                    >
                      Fixed
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800"
                      onClick={() => handleOptionClick('%')}
                    >
                      %
                    </a>
                  </div>
                )}

              </div>


            </div>

          </div>




        </div>






      </div>



      <div>
        <h2 className='block text-[14px] md:text-[16px] font-semibold text-gray-600 dark:text-white'>
          Delivery Charge
        </h2>
        <div className='flex rounded-lg justify-between  items-center shadow-[rgba(0,_0,_0,_0.20)_0px_2px_6px] hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-100 px-1 md:py-2 py-0'>
          <div className="form-control">
            <label className="cursor-pointer gap-1 label">
              <input
                type="radio"
                name="deliveryCharge"
                value={selectedBusiness[0]?.inside_dhaka}
                onChange={handleChange}
                className="radio radio-info"
              />
              <span className="text-sm">Inside Dhaka ৳ {selectedBusiness[0]?.inside_dhaka}</span>
            </label>
          </div>
          {errors.deliveryCharge && (
            <p className="text-red-500 text-sm">{errors.deliveryCharge[0]}</p>
          )}

          <div className="form-control">
            <label className="cursor-pointer gap-1 label">
              <input
                type="radio"
                name="deliveryCharge"
                value={selectedBusiness[0]?.outside_dhaka}
                onChange={handleChange}
                className="radio radio-info"
              />
              <span className="text-sm">Outside Dhaka ৳ {selectedBusiness[0]?.outside_dhaka}</span>
            </label>
          </div>
        </div>


      </div>





      {/* <div>
  <Amount totalPrice={totalPrice}/>
</div> */}
      {deliveryChargeNum > 0 && (
        <div className='flex justify-between items-center'>
          <h1 className='md:text-[15px] text-[13px] text-gray-400'>Delivery Charge</h1>
          <h1 className='text-gray-400 text-[14px]'>
             {deliveryChargeNum}
          </h1>
        </div>
      )}

      {totalPriceNum > 0 && (
        <div className='flex justify-between items-center'>
          <h1 className='md:text-[15px] text-[13px] text-gray-400'>Order Price</h1>
          <h1 className='text-gray-400 text-[14px]'>
             {totalPriceNum} <span className='text-[15px] md:text-[12px]'>৳</span>

          </h1>
        </div>
      )}

      {inputValue && (
        <div className='flex justify-between items-center mt-2'>
          <h1 className='md:text-[15px] text-[13px] text-gray-400'>Discount</h1>
          <h1 className="text-gray-400 text-[14px]">
            {inputValue ? (
              <span>
                {selectedOption === '%' ? `${inputValue}%` : `৳${inputValue}`}
              </span>
            ) : (
              <>
                <span className="text-[15px] md:text-[12px]">৳</span> 0
              </>
            )}
          </h1>
        </div>
      )}

      {advance && advance > 0 && (
        <div className='flex justify-between items-center'>
          <h1 className='md:text-[15px] text-[13px] text-gray-400'>Advance</h1>
          <h1 className='text-gray-400 text-[14px]'>
             {advanceNum} 
<span className='text-[15px] md:text-[12px]'>৳</span>

          </h1>
        </div>
      )}

      {totalPriceNum > 0 && (
        <div className='flex justify-between items-center'>
          <h1 className='md:text-[15px] text-[13px] text-gray-400'>Due</h1>
          <h1 className='text-gray-400 text-[14px]'>
             {dueAmount} <span className='text-[15px] md:text-[12px]'>৳</span>

          </h1>
        </div>
      )}

      {totalPriceNum > 0 && (<div className='flex justify-between items-center'>
        <h1 className='md:text-[15px] text-[13px] text-gray-500'>Subtotal</h1>
        <h1 className='text-gray-500 text-[14px]'>
           {dueAmount} <span className='text-[15px] md:text-[12px]'>৳</span>

        </h1>
      </div>
      )}

<div className='my-5'>
  <button
    type="submit"
    className="w-full rounded-lg px-2 py-3 text-white bg-[#28DEFC] hover:bg-[#444CB4] flex justify-between items-center"
    disabled={loading} // Disable button while loading
    onClick={handleSave}
  >
    {loading ? (
      <div className='flex justify-center w-full'>
        <ImSpinner10 className='animate-spin text-white' size={20} />
        <span className='px-2'>Saving...</span>
      </div>
    ) : (
      <>
        <h1 className='text-[18px] font-bold'>Save Order</h1>
        <h1 className='text-[18px] font-bold '>
          {dueAmount}  <span className='text-[18px] font-bold '>৳</span>
        </h1>
      </>
    )}
  </button>
</div>




    </form>
  );
};

export default Schedule;
