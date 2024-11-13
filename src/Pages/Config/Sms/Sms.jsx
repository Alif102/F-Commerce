import React, { useState, useEffect } from "react";
import { FaTag } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { FaEllipsisV,  FaTrash , FaRegEdit} from "react-icons/fa";
import Select from 'react-select';
import { ImSpinner10 } from "react-icons/im";



const Sms = () => {
  const [isActive, setIsActive] = useState();
  const [ScheduleisActive, setScheduleSIsActive] = useState();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const clientId = localStorage.getItem("clientId");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sh_loading, setShLoading] = useState(false);

  const [smsTitle, setSmsTitle] = useState('');
  const [SmsBody, setSmsBody] = useState('');

  const handleErrors = (newErrors) => {
    setErrors(newErrors);
  };





  const [sms, setSms] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null); 
  const [ScheduleSelectedTemplate, setScheduleSelectedTemplate] = useState(null); 

  const [remainingChars, setRemainingChars] = useState(160);
  const [scheduleRemainingChars, setScheduleRemainingChars] = useState(160);


  const [orderSmsText, setOrderSmsText] = useState(''); // Correct variable
  const [bodyText, setBodyText] = useState('');
  const [ScheduleBodyText, setScheduleBodyText] = useState('');


  // Fetch the default SMS text
  useEffect(() => {
    const fetchDefaultMsg = async () => {
      try {
        const response = await axios.get(`https://admin.ezicalc.com/api/sms/default/get/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        // Assuming response.data.data contains the SMS text
        setOrderSmsText(response.data.data.order_sms_text);
        setIsActive(response.data.data.sms_status);
        setScheduleSIsActive(response.data.data.schedule_sms_status);

        setBodyText(response.data.data.order_sms_text);
        setScheduleBodyText(response.data.data.order_schedule_sms_text);
        
        // Adjust based on actual response structure
      } catch (error) {
        console.error('Error fetching defaultMsg:', error);
      }
    };

    fetchDefaultMsg();
  }, [token, clientId]);
  // Fetch SMS data
  const fetchSMS = async () => { 
    try {
      const response = await axios.get(`https://admin.ezicalc.com/api/sms/template/get-all/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        setSms(response.data.data);
      } else {
        console.error('Failed to fetch SMS templates:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching SMS templates:', error);
    }
  };


  console.log(orderSmsText);


  useEffect(() => {
    fetchSMS();
  }, [token, clientId]);


  // Prepare options for react-select
  const options = sms.map((template) => ({
    value: template.id,
    label: template.title,
    body: template.body,
  }));

  // Handle selection change
  const handleSelectChange = (selectedOption) => {
    setSelectedTemplate(selectedOption);
    const body = selectedOption ? selectedOption.body : '';
    setBodyText(body);
    setRemainingChars(160 - body.length);

    // Save selected template to localStorage
    localStorage.setItem('selectedTemplate', JSON.stringify(selectedOption));
  };
  const handleScheduleSelectChange = (selectedOption) => {
    setScheduleSelectedTemplate(selectedOption);
    const body = selectedOption ? selectedOption.body : '';
    setScheduleBodyText(body);
    setScheduleRemainingChars(160 - body.length);

    // Save selected template to localStorage
    localStorage.setItem('ScheduleSelectedTemplate', JSON.stringify(selectedOption));
  };

  const handleTextareaChange = (event) => {
    const newText = event.target.value;
    setBodyText(newText);
    setRemainingChars(160 - newText.length);
  };
  const handleScheduleTextareaChange = (event) => {
    const newText = event.target.value;
    setScheduleBodyText(newText);
    setScheduleRemainingChars(160 - newText.length);
  };

  // Retrieve selected template from localStorage when component mounts


  useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      const template = JSON.parse(savedTemplate);
      setSelectedTemplate(template);
      setBodyText(template.body);
      setRemainingChars(160 - template.body.length);
    }
  }, []);


  useEffect(() => {
    const savedTemplate = localStorage.getItem('ScheduleSelectedTemplate');
    if (savedTemplate) {
      const template = JSON.parse(savedTemplate);
      setScheduleSelectedTemplate(template);
      setScheduleBodyText(template.body);
      setScheduleRemainingChars(160 - template.body.length);
    }
  }, []);

  // Handle form submission
 const handleSubmit = async () => {
  setLoading(true); // Set loading to true before making the API call
  try {
    const response = await axios.post(
      'https://admin.ezicalc.com/api/sms/default/set',
      {
        sms_status: isActive ? '1' : '0',
        client_id: clientId,
        order_sms_text: bodyText, 
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.data.status) {
      toast.success('SMS template updated successfully!');
    } else {
      toast.error('Failed to update SMS template: ' + response.data.message);
    }
  } catch (error) {
    console.error('Error making API call', error);
    toast.error('Error making API call');
  } finally {
    setLoading(false); // Set loading to false after the API call completes (either success or failure)
  }
};

const handleScheduleSubmit = async () => {
  setShLoading(true); // Start loading
  try {
    const response = await axios.post(
      'https://admin.ezicalc.com/api/sms/default/set',
      {
        schedule_sms_status: isActive ? '1' : '0',
        client_id: clientId,
        order_schedule_sms_text: ScheduleBodyText,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.data.status) {
      toast.success('SMS template updated successfully!');
    } else {
      toast.error('Failed to update SMS template: ' + response.data.message);
    }
  } catch (error) {
    console.error('Error making API call', error);
    toast.error('Error making API call');
  } finally {
    setShLoading(false); // Stop loading
  }
};

  // Handle toggle change
  const handleToggle = async (event) => {
    const newValue = event.target.checked;
    const smsStatus = newValue ? '1' : '';

    setIsActive(newValue);

    try {
      const response = await axios.post(
        'https://admin.ezicalc.com/api/sms/default/set',
        {
          sms_status: smsStatus,
          client_id: clientId,
         
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        toast.success('SMS Status Change successful');
      } else {

        console.log(response.data.message);
        toast.error('SMS Status Change failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error making API call', error);


    }
  };

  // Handle Schedule toggle change

  const handleScheduleToggle = async (event) => {
    const newValue = event.target.checked;
    const smsStatus = newValue ? '1' : '';

    setScheduleSIsActive(newValue);

    try {
      const response = await axios.post(
        'https://admin.ezicalc.com/api/sms/default/set',
        {
          schedule_sms_status: smsStatus,
          client_id: clientId,
         
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        toast.success('SMS Status Change successful');
      } else {

        console.log(response.data.message);
        toast.error('SMS Status Change failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error making API call', error);


    }
  };



  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('title', smsTitle);
    formData.append('body', SmsBody);
    formData.append('created_by', userId);

    setLoading(true); // Start loading
    try {
      const response = await axios.post('https://admin.ezicalc.com/api/sms/template/create', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: response.data.message || "SMS created successfully!",
          showConfirmButton: false,
          timer: 2000
        });

        // Clear form fields
        setSmsTitle('');
        setSmsBody('');
        setErrors({});
        handleErrors('');

        // Close the modal
        document.getElementById('my_modal_6').checked = false;  // Close the modal programmatically

        fetchSMS();

         
      } else {
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

 
  




  const [editSms, setEditSms] = useState(null);
  const [editSmsTitle, setEditSmsTitle] = useState('');
  const [editSmsBody, setEditSmsBody] = useState('');
  const [templateId, setTemplateId] = useState(null); 

  const handleEdit = (id) => {
    const smsToEdit = sms.find(sms => sms.id === id);
    setEditSms(smsToEdit);
    setEditSmsTitle(smsToEdit ? smsToEdit.title : '');
    setEditSmsBody(smsToEdit ? smsToEdit.body : '');
    setTemplateId(id);
  };

  


  const handleEditSave = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('template_id', templateId);
    formData.append('title', editSmsTitle);
    formData.append('body', editSmsBody);
    formData.append('created_by', userId);
  
    setLoading(true); // Start loading
    try {
      const response = await axios.post('https://admin.ezicalc.com/api/sms/template/update', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.data.status) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.data.message || 'SMS updated successfully!',
          showConfirmButton: false,
          timer: 2000
        });
  
        // Update local state immediately
        setSms(prevSms =>
          prevSms.map(sms =>
            sms.id === templateId
              ? { ...sms, title: editSmsTitle, body: editSmsBody }
              : sms
          )
        );
  
        // Clear form fields
        setEditSms(null);
        setEditSmsTitle('');
        setEditSmsBody('');
        setTemplateId(null);
        setErrors({});
        handleErrors('');
  
        // Close the modal
        document.getElementById('my_modal_edit').checked = false;  // Close the modal programmatically
      } else {
        const newErrors = response.data.error || {};
        setErrors(newErrors);
        handleErrors(newErrors);
        toast.error(Object.keys(response.data.error).map((field) => ` ${response.data.error[field][0]}`).join(' '));
      }
    } catch (error) {
      console.error('Error saving SMS:', error.response ? error.response.data : error.message);
    } finally {
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
        const response = await axios.delete(`https://admin.ezicalc.com/api/sms/template/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data.status) {
          Swal.fire('Deleted!', response.data.message || 'SMS deleted successfully.', 'success');
  
          // Remove the deleted SMS from the state
          setSms((prevSms) => prevSms.filter((sms) => sms.id !== id));
        } else {
          Swal.fire('Error!', response.data.message || 'Failed to delete SMS.', 'error');
        }
      } catch (error) {
        console.error('Error deleting SMS:', error.response ? error.response.data : error.message);
        Swal.fire('Error!', 'Failed to delete SMS.', 'error');
      }
    }
  };






  // SE
  
  


  return (
    <div className="mx-4 md:mx-10">
      <div className="w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300  mb-5">
        <h2 className="px-4 text-xl font-semibold">Marketing SMS</h2>
        <div className="ml-auto flex items-center">
          <label
            htmlFor="my_modal_6"
            className="bg-[#28DEFC] text-white font-semibold py-1 px-6 mr-5 rounded cursor-pointer hover:bg-[#28DEFC]"
          >
            Add
          </label>

          <input type="checkbox" id="my_modal_6" className="modal-toggle" />
          <div className="modal" role="dialog">
            <form onSubmit={handleSave} className="modal-box">
              <div className="flex justify-between font-bold pb-3">
                <p className="text-2xl">Add SMS</p>
                <label htmlFor="my_modal_6" className="text-3xl cursor-pointer">
                  <IoClose />
                </label>
              </div>

              <div className="w-full max-w-md mx-auto mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  SMS Title
                </label>
                <input
                  name="title"

                  className="shadow appearance-none hover:border-blue-500  focus:ring-blue-500 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2   transition duration-150 ease-in-out"
                  type="text"
                  placeholder="Enter Title"
                  value={smsTitle}
                  onChange={(e) => setSmsTitle(e.target.value)}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title[0]}</p>}

              </div>

              <div className="w-full max-w-md mx-auto mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  SMS Body
                </label>
                <div>
                  <textarea
                    name="body"
                    value={SmsBody}
                    onChange={(e) => setSmsBody(e.target.value)}
                    className="shadow appearance-none hover:border-blue-500  focus:ring-blue-500 border rounded w-full h-28 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2   transition duration-150 ease-in-out resize-none"
                    placeholder="Write SMS"
                  />
                  {errors.body && <p className="text-red-500 text-sm">{errors.body[0]}</p>}

                  <p className="text-gray-600 text-sm">
                    No more than 160 characters
                  </p>
                </div>
              </div>

              <div >
               
                <ul
                  
                  className=" flex justify-evenly font-semibold mt-4 "
                >
                  <li className=" list-none">
                    <a>[User Name]</a>
                  </li>
                  <li className=" list-none">
                    <a>[User ID]</a>
                  </li>
                  <li className=" list-none">
                    <a>[User Bill]</a>
                  </li>
                  <li className=" list-none">
                    <a>[User Due]</a>
                  </li>
                </ul>
              </div>
              <div className="flex justify-end modal-action">
                <button type="submit" className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white ">
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
        </div>
      </div>

      <div className="overflow-auto xl:overflow-hidden mt-6 mb-5">
        <table className="table mb-24">
          {/* head */}
          <thead className="text-gray-600 bg-[#EFEFEF]">
            <tr>
              <th className="text-[15px]">SL</th>
              <th className="text-[15px]">SMS Title</th>
              <th className="text-[15px]">SMS Body</th>
              <th className="text-[15px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {sms.map((sms, index) => (
              <tr key={index} className="hover">
                <th className="text-[15px]">{index + 1}</th>
                <td className="text-[15px] w-[30%]">{sms.title}</td>
                <td className="text-[15px] w-[50%]">{sms.body}</td>
                <div className="dropdown dropdown-end">
                <td>
                  <button className="text-[20px]">
                    <FaEllipsisV />
                  </button>
                </td>
                <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                  >
                   
                  
                   <li key={sms.id}>



               



      <label  htmlFor="my_modal_edit"   onClick={() => handleEdit(sms.id)}>
        <FaRegEdit className="text-green-500 text-[20px] pl-1" />
        Edit
      </label>
    </li>
                    <li>
                      <a onClick={() => handleDelete(sms.id)}>
                        <FaTrash className="text-red-500 text-[20px]" />
                        Delete
                      </a>
                    </li>
                  </ul>
              </div>
              </tr>
            ))}
          </tbody>
        </table>
      </div>




{/* edit modal */}



<input type="checkbox" id="my_modal_edit" className="modal-toggle" />
          <div className="modal" role="dialog">
            <form onSubmit={handleEditSave} className="modal-box">
              <div className="flex justify-between font-bold pb-3">
                <p className="text-2xl">Update SMS</p>
                <label
                  htmlFor="my_modal_edit"
                  className="text-3xl cursor-pointer"
                >
                  <IoClose />
                </label>
              </div>

              <div className="w-full max-w-md mx-auto mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  SMS Title
                </label>
                <input
        name="title"
        className="shadow appearance-none hover:border-blue-500  focus:ring-blue-500 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2   transition duration-150 ease-in-out"
        type="text"
        placeholder="Enter Title"
        value={editSmsTitle}
        onChange={(e) => setEditSmsTitle(e.target.value)}
      />
                {errors.editSmsTitle && <p className="text-red-500 text-sm">{errors.editSmsTitle[0]}</p>}

              </div>

              <div className="w-full max-w-md mx-auto mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  SMS Body
                </label>
                <div>
                  <textarea
                    name="body"
                    value={editSmsBody}
                    onChange={(e) => setEditSmsBody(e.target.value)}
                    className="shadow appearance-none hover:border-blue-500  focus:ring-blue-500 border rounded w-full h-28 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2   transition duration-150 ease-in-out resize-none"
                    placeholder="Write SMS"
                  />
                  {errors.editSmsBody && <p className="text-red-500 text-sm">{errors.editSmsBody[0]}</p>}

                  <p className="text-gray-600 text-sm">
                    No more than 160 characters
                  </p>
                </div>
              </div>

              
              <div >
               
                <ul
                  
                  className=" flex justify-evenly font-semibold mt-4 "
                >
                  <li className=" list-none">
                    <a>[User Name]</a>
                  </li>
                  <li className=" list-none">
                    <a>[User ID]</a>
                  </li>
                  <li className=" list-none">
                    <a>[User Bill]</a>
                  </li>
                  <li className=" list-none">
                    <a>[User Due]</a>
                  </li>
                </ul>
              </div>
              <div className="flex justify-end modal-action">
                {/* <button type="submit" className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white ">Update</button> */}

                <button
    type="submit"
className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white "
  >
    {loading ? (
      <div className='flex justify-center items-center w-full'>
        <ImSpinner10 className='animate-spin text-white' size={20} />
        <span className='px-2'>Updating...</span>
      </div>
    ) : (
      <>
       <h1>Update</h1>
      </>
    )}
  </button>

              </div>


            </form>
          </div>



{/* end edit modal */}



<div>
    <div className="w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300  mb-5">
      <h2 className="px-4 text-xl font-semibold">Order complete SMS</h2>
      <div className="ml-auto flex items-center mr-10">
        <input
          type="checkbox"
          className="toggle toggle-info scale-75"
          checked={isActive}
          onChange={handleToggle}
        />
        <span className="text-lg font-semibold">
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>

    {isActive && (
   <div className="shadow-sm pb-4 mb-4 rounded-md border border-gray-300">
   <br />
   <div className="mx-5">
     {/* Default SMS */}
     <div className="text-lg mb-3">
       <div className="my-2 font-bold">Default SMS</div>
       <div className="py-4 px-5 shadow-sm rounded-md border border-gray-300">
         [কোম্পানীর নাম] আপনার অর্ডার নিশ্চিত করা হয়েছে। অর্ডার আইডি: 123456। মোট পরিমাণ: 1250 টাকা পেড: 1200 টাকা পরিশোধনীয়: 00 টাকা
       </div>
     </div>


     {/* select sms title */}
     <div className="sms-template-dropdown">
      <h2 className="my-2 font-bold">Select SMS Template</h2>

      {/* React Select Dropdown */}
      <Select
        options={options}
        value={selectedTemplate}
        onChange={handleSelectChange}
        placeholder="Select a template"
      />

      {/* Display the textarea with SMS body */}
      <div className="text-lg mt-5">
        <div className="font-bold my-2">Custom SMS</div>
        <textarea
          value={bodyText} 
          onChange={handleTextareaChange}
          placeholder="Write custom message....."
          className="w-full py-4 px-5 hover:border-blue-500 focus:outline-none shadow-sm rounded-md border border-gray-300 resize-none"
          maxLength="160"
        />
        <p className="text-gray-600 text-sm mt-1">
          {remainingChars} characters remaining
        </p>
      </div>

   

    </div>

     {/* Custom SMS */}
    
   </div>

   {/* Save Button */}
   <div className="flex justify-end mt-4 mx-5">
     {/* <button
       onClick={handleSubmit}
       className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white px-6 text-lg"
     >
       Save
     </button> */}

     <button
    onClick={handleSubmit}
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
 </div>
    )}
  </div>





  {/* schedule order */}


  <div>
    <div className="w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300  mb-5">
      <h2 className="px-4 text-xl font-semibold">Schedule complete SMS</h2>
      <div className="ml-auto flex items-center mr-10">
        <input
          type="checkbox"
          className="toggle toggle-info scale-75"
          checked={ScheduleisActive}
          onChange={handleScheduleToggle}
        />
        <span className="text-lg font-semibold">
          {ScheduleisActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>

    {ScheduleisActive && (
   <div className="shadow-sm pb-4 mb-4 rounded-md border border-gray-300">
   <br />
   <div className="mx-5">
     {/* Default SMS */}
     <div className="text-lg mb-3">
       <div className="my-2 font-bold">Default SMS</div>
       <div className="py-4 px-5 shadow-sm rounded-md border border-gray-300">
         [কোম্পানীর নাম] আপনার অর্ডার নিশ্চিত করা হয়েছে। অর্ডার আইডি: 123456। মোট পরিমাণ: 1250 টাকা পেড: 1200 টাকা পরিশোধনীয়: 00 টাকা
       </div>
     </div>


     {/* select sms title */}
     <div className="sms-template-dropdown">
      <h2 className="my-2 font-bold">Select SMS Template</h2>

      {/* React Select Dropdown */}
      <Select
        options={options}
        value={ScheduleSelectedTemplate}
        onChange={handleScheduleSelectChange}
        placeholder="Select a template"
      />

      {/* Display the textarea with SMS body */}
      <div className="text-lg mt-5">
        <div className="font-bold my-2">Custom SMS</div>
        <textarea
          value={ScheduleBodyText} 
          onChange={handleScheduleTextareaChange}
          placeholder="Write custom message....."
          className="w-full py-4 px-5 hover:border-blue-500 focus:outline-none shadow-sm rounded-md border border-gray-300 resize-none"
          maxLength="160"
        />
        <p className="text-gray-600 text-sm mt-1">
          {scheduleRemainingChars} characters remaining
        </p>
      </div>

   

    </div>

     {/* Custom SMS */}
    
   </div>

   {/* Save Button */}
   <div className="flex justify-end mt-4 mx-5">
     <button
       onClick={handleScheduleSubmit}
       className="btn bg-[#28DEFC] hover:bg-[#28DEFC] text-white px-6 text-lg"
     >
       {sh_loading ? (
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
 </div>
    )}
  </div>
    </div>
  );
};

export default Sms;
