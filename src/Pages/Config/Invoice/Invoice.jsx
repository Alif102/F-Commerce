import React, { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import AllSelectedBusiness from '../../../Component/AllSelectedBusiness';
import axios from 'axios';
import Swal from 'sweetalert2';
import invoiceOne from '../../../assets/invoiceOne.png';
import invoiceTwo from '../../../assets/invoiceTwo.png';
import InvoiceFour from '../../../assets/InvoiceFour.png';
import invoiceThree from '../../../assets/invoiceThree.png';

const Invoice = () => {
  const token = localStorage.getItem("token");
  const clientId = localStorage.getItem("clientId");

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false); // New loading state for invoice fetching
  const [activeInvoice, setActiveInvoice] = useState(0); // Track the active invoice

  const handleToggleSelect = (invoiceNumber) => {
    setActiveInvoice(activeInvoice === invoiceNumber ? 0 : invoiceNumber); // Toggle the selected invoice
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("business_id", selectedBusiness);
    formData.append("invoice_nbr", activeInvoice); // Send the currently active invoice

    setLoading(true);
    try {
      const response = await axios.post(
        "https://admin.ezicalc.com/api/invoice/set",
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
          title: response.data.message || "Invoice created successfully!",
          showConfirmButton: false,
          timer: 2000,
        });
        // Do not reset activeInvoice to 0
      } else {
        setErrors(response.data.error || {});
      }
    } catch (error) {
      console.error("Error saving API data:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const [getInvoice, setGetInvoice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      setInvoiceLoading(true); // Set loading to true when starting to fetch invoice data
      try {
        const response = await axios.get(`https://admin.ezicalc.com/api/selected/invoice/get/${selectedBusiness}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setGetInvoice(response.data);
        // Set the active invoice based on fetched data
        if (response.data.status) {
          const { invoice_nbr } = response.data.data;
          setActiveInvoice(invoice_nbr); // Set the active invoice to the fetched one
        }
      } catch (err) {
        setError(err);
      } finally {
        setInvoiceLoading(false); // Set loading to false after fetching is done
      }
    };

    if (selectedBusiness) {
      fetchInvoice();
    }
  }, [selectedBusiness]);

  return (
    <div className="mx-4 md:mx-10">
      <div className="mb-5 w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 ">
        <h2 className="px-4 text-xl font-semibold">Invoice Setup</h2>
        <div className="ml-auto flex items-center">
          <AllSelectedBusiness onBusinessSelect={setSelectedBusiness} 
          // defaultToFirst={true}
           />
        </div>
      </div>

      <div className="shadow-sm border border-gray-300 rounded-md px-5 pb-4 mb-4">
        <br />
        <div className="mb-3 text-xl font-semibold">Business Name</div>
        
        {/* Show loading text or spinner while fetching invoices */}
        {invoiceLoading ? (
          <div className="flex justify-center flex-col items-center h-64">
             <span className="loading loading-ring loading-md"></span>
            <span className="ml-2">Loading Invoices...</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-5 justify-evenly flex-col md:flex-row">
           

            {/* First Invoice Section */}
            <div>
              <div className="flex items-center justify-center mb-4">
                <h1 className="mr-2">{activeInvoice === 1 ? 'Active' : 'Inactive'}</h1>
                <input
                  type="checkbox"
                  className="toggle toggle-info"
                  checked={activeInvoice === 1} // Only checked if this is the active invoice
                  onChange={() => handleToggleSelect(1)}
                />
              </div>
              <div className="w-[300px] h-[300px] overflow-auto relative">
                <img className='w-[300px] h-[250px]' src={invoiceTwo} alt="invoice" />
                {activeInvoice === 1 && (
                  <div className="absolute top-24 right-32 text-white bg-sky-400 p-3 rounded-full cursor-pointer">
                    <FaCheck size={24} />
                  </div>
                )}
              </div>
            </div>

            {/* Second Invoice Section */}
            <div>
              <div className="flex items-center justify-center mb-4">
                <h1 className="mr-2">{activeInvoice === 2 ? 'Active' : 'Inactive'}</h1>
                <input
                  type="checkbox"
                  className="toggle toggle-info"
                  checked={activeInvoice === 2} // Only checked if this is the active invoice
                  onChange={() => handleToggleSelect(2)}
                />
              </div>
              <div className="w-[300px] h-[300px] overflow-auto relative">
                <img className='w-[300px] h-[250px]' src={invoiceOne} alt="invoice" />
                {activeInvoice === 2 && (
                  <div className="absolute top-24 right-32 text-white bg-sky-400 p-3 rounded-full cursor-pointer">
                    <FaCheck size={24} />
                  </div>
                )}
              </div>
            </div>

            {/* Three Invoice Section */}
            <div>
              <div className="flex items-center justify-center mb-4">
                <h1 className="mr-2">{activeInvoice === 3 ? 'Active' : 'Inactive'}</h1>
                <input
                  type="checkbox"
                  className="toggle toggle-info"
                  checked={activeInvoice === 3} // Only checked if this is the active invoice
                  onChange={() => handleToggleSelect(3)}
                />
              </div>
              <div className="w-[300px] h-[300px] overflow-auto relative">
                <img className='w-[300px] h-[250px]' src={invoiceThree} alt="invoice" />
                {activeInvoice === 3 && (
                  <div className="absolute top-24 right-32 text-white bg-sky-400 p-3 rounded-full cursor-pointer">
                    <FaCheck size={24} />
                  </div>
                )}
              </div>
            </div>

             {/* Four Invoice Section */}
             <div>
              <div className="flex items-center justify-center mb-4">
                <h1 className="mr-2">{activeInvoice === 4 ? 'Active' : 'Inactive'}</h1>
                <input
                  type="checkbox"
                  className="toggle toggle-info"
                  checked={activeInvoice === 4} // Only checked if this is the active invoice
                  onChange={() => handleToggleSelect(4)}
                />
              </div>
              <div className="w-[300px] h-[300px] overflow-auto relative">
                <img className='w-[300px] h-[250px]' src={InvoiceFour} alt="invoice" />
                {activeInvoice === 4 && (
                  <div className="absolute top-24 right-32 text-white bg-sky-400 p-3 rounded-full cursor-pointer">
                    <FaCheck size={24} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-16">
          <div className="flex justify-end mt-4">
            {/* <button className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white px-6 text-lg">
              View
            </button> */}
          </div>
          <div className="flex justify-end mt-4">
            <button className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white px-6 text-lg" onClick={handleSave}>
              {loading ? 'Saving...' : 'Save'} {/* Change button text based on loading state */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
