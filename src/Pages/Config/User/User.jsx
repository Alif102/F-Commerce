
import React, { useState, useEffect } from "react";

import axios from "axios";
import toast from "react-hot-toast";

import { CiMenuKebab } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Select from "react-select";
import Swal from "sweetalert2";
import { ImSpinner10 } from "react-icons/im";

const User = ({onUpdateUserInfo}) => {

  const [editData, setEditData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [businesses, setBusinesses] = useState([]);


  const [editId, setEditId] = useState('');


  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');

  const [editbusinesses, setEditBusinesses] = useState([]);


  const [users, setUsers] = useState([]);


  const [errors, setErrors] = useState({});


  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  console.log(userId)
 
  const clientId = localStorage.getItem("clientId");
  console.log(clientId)

  const [currentPage, setCurrentPage] = useState(1);





  const fetchUser = async () => {
    try {
      const response = await axios.get(`https://admin.ezicalc.com/api/user/get_all/${clientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);
  const [roleId, setRoleId] = useState(''); // Initialize state for roleId

  const handleRoleChange = (selectedOption) => {
    setRoleId(selectedOption ? selectedOption.value : null); // Set roleId to the selected option's value
  };


  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("user_id", userId);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("role_id", roleId);
    formData.append("pass", password);
    formData.append("business_id", 2);

    formData.append("confirm_pass", confirmPassword);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://admin.ezicalc.com/api/user/create",
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
          response.data.message || "Business created successfully!",
          {
            duration: 2000,
            position: "top-right",
          }
        );

        // Reset form fields
        setName("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setRoleId("")
        setErrors({});
        document.getElementById("my_modal_3").close();

        // Refresh the businesses list
        fetchUser();
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
         
        setErrors(response.data.error || {});
      }
    } catch (error) {
     
      console.error(
        "Error saving business:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        "An error occurred while saving the business. Please try again."
      );
    }finally {
      setLoading(false); 
    }
  };


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});


  const handleEdit = (user) => {


    console.log(user);
    setSelectedUser(user);


    setEditId(user.id);

    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditPassword(user.pass);
    setEditConfirmPassword(user.pass);



    setIsModalOpen(true); // Open the modal
  };




  const handleEditSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("user_id", editId);
    formData.append("name", editName);
    formData.append("phone", editPhone);
    formData.append("email", editEmail);
    formData.append("pass", editPassword);
    formData.append("business_id", 2);
    formData.append("confirm_pass", editConfirmPassword);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        "https://admin.ezicalc.com/api/user/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      //  if (Number(response.data.data.id) === Number(clientId)) {
      //   onUpdateUserInfo(); // Call only if client_id matches
      // }

      if (response.data.status) {
       
        
        toast.success(
          response.data.message || "User Edited successfully!",
          {
            duration: 2000,
            position: "top-right",
          }
        );

        // Reset form fields
        setEditId("");


        setEditName("");
        setEditPhone("");
        setEditEmail("");
        setEditConfirmPassword("");
        setEditPassword("");
        setErrors({});
        setIsModalOpen(false);

        fetchUser();
      } else {
        setErrors(response.data.error || {});
      }
    } catch (error) {
      console.error(
        "Error saving business:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        "An error occurred while saving the business. Please try again."
      );
    } finally {
      setLoading(false);
    }
};





  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [selectedRole, setSelectedRole] = useState(null);
  const roleOptions = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Employee' },
  ];



  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db', // Blue border on focus
      boxShadow: state.isFocused ? '0 0 0 2px #3b82f6' : '',
      '&:hover': { borderColor: '#3b82f6' }, // Hover border color
      padding: '2px',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af', // Placeholder text color
    }),
  };


  const handleDelete = async (id) => {
    // Prevent deletion for the user with index 2
    const protectedUserId = users[0]?.id; // Get the ID of the user at index 2
    
    if (id === protectedUserId) {
      Swal.fire('Error!', 'You cannot delete this user.', 'error');
      return; // Exit the function early
    }
  
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
        const response = await axios.delete(`https://admin.ezicalc.com/api/user/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data.status) {
          Swal.fire('Deleted!', response.data.message || 'USER deleted successfullyyy.');
  
          // Remove the deleted SMS from the state
          setUsers((prevSms) => prevSms.filter((sms) => sms.id !== id));
        } else {
          Swal.fire('Error!', response.data.message || 'Failed to delete SMS.', 'error');
        }
      } catch (error) {
        console.error('Error deleting SMS:', error.response ? error.response.data : error.message);
        Swal.fire('Error!', 'Failed to delete SMS.', 'error');
      }
    }
  };
  
  console.log(users)


  return (
    <div className=" mx-4 md:mx-10 flex flex-col justify-between">
      <div className="flex-grow">
        <div className="w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 ">
          <h2 className="px-4 text-xl font-semibold">User</h2>
          <div className="ml-auto flex items-center">


            <button
              className="bg-[#28DEFC] text-white font-semibold py-1 px-6 mr-5 rounded cursor-pointer"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              Add
            </button>

            <form onSubmit={handleSave}>

              <dialog id="my_modal_3" className="modal">
                <div className="modal-box px-2">
                  <div className="flex justify-between items-center px-6 mb-2">
                    <p className="text-2xl">
                      <b>Add User</b>
                    </p>
                    <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost text-3xl">
                        <IoClose />
                      </button>
                    </form>
                  </div>
                  <div className="w-full max-w-md mx-auto mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      User Name
                    </label>
                    <input
                      className="shadow  border rounded w-full py-2 px-3 text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="username"
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
                  </div>

                  <div className="w-full max-w-md mx-auto mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      User Phone Number
                    </label>
                    <input
                      className="shadow  border rounded w-full py-2 px-3 text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="usernumber"
                      type="number"
                      placeholder="Enter your number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone[0]}</p>}

                  </div>






                  <div className="w-full max-w-md mx-auto mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      User Mail
                    </label>
                    <input
                      className="shadow  border rounded w-full py-2 px-3 text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="useremail"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}

                  </div>

                  <div className="w-full max-w-md mx-auto mb-4">

                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Select Role
                    </label>
                    <Select
                      options={roleOptions}
                      value={roleOptions.find(option => option.value === roleId)}
                      onChange={handleRoleChange}
                      placeholder="Select Role"
                      isClearable
                      styles={customSelectStyles}
                      className="shadow"
                    />
                    {errors.role_id && <p className="text-red-500 text-sm">{errors.role_id[0]}</p>}

                  </div>




                  <div className="w-full max-w-md mx-auto mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      User Password
                    </label>
                    <input
                      className="shadow  border rounded w-full py-2 px-3 text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                      id="userpassword"
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.pass && <p className="text-red-500 text-sm">{errors.pass[0]}</p>}

                  </div>


                  <div className="w-full max-w-md mx-auto mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Confirm Password
                    </label>
                    <input
                      className="shadow  border rounded w-full py-2 px-3 text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="confirmpassword"
                      type="password"
                      placeholder="Enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirm_pass && <p className="text-red-500 text-sm">{errors.confirm_pass[0]}</p>}

                  </div>

                  <div className="modal-action  px-5">
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
                </div>
              </dialog>

            </form>


           
          </div>
        </div>

        <div className="my-6 overflow-x-auto  ">
          {/* <table className="table w-full bg-red-300 mb-20">
            <thead className="text-gray-600 bg-[#EFEFEF]">
              <tr>
                <th className="text-[15px]">SL</th>
                <th className="text-[15px]">Name</th>
                <th className="text-[15px]">Number</th>
                <th className="text-[15px]">Mail</th>
                <th className="text-[15px]">Password</th>
                <th className="text-[15px]">Action</th>
              </tr>
            </thead>
            <tbody>

              {users.map((user, index) => (

                <tr className="hover">
                  <th className="text-[15px]">{index + 1}</th>
                  <td className="text-[15px]">{user.name}</td>
                  <td className="text-[15px]">{user.phone}</td>
                  <td className="text-[15px]">{user.email}</td>
                  <td className="text-[15px]">{user.pass}</td>
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
                          <a onClick={() => handleEdit(user)}>
                            <FaRegEdit className="text-green-500 text-[20px] pl-1" />
                            Edit
                          </a>
                        </li>
                        <li>
                          <a onClick={() => handleDelete(user.id)}>
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
          </table> */}

<table className="table w-full mb-28">
        <thead className="text-gray-600 bg-[#EFEFEF]">
       
          <tr>
                <th className="text-[15px]">SL</th>
                <th className="text-[15px]">Name</th>
                <th className="text-[15px]">Number</th>
                <th className="text-[15px]">Mail</th>
                <th className="text-[15px]">Password</th>
                <th className="text-[15px]">Action</th>
              </tr>
         
        </thead>
        <tbody className=" divide-y divide-gray-200 overflow-y-hidden h-auto">
        {users.length > 0 ? (
          users.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-100 text-sky-800">
              <td className="text-[15px] whitespace-nowrap">{index + 1}</td>
                  <td className="text-[15px]">{user.name}</td>
                  <td className="text-[15px]">{user.phone}</td>
                  <td className="text-[15px]">{user.email}</td>
                  <td className="text-[15px]">{user.pass}</td>
            
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
                      <a onClick={() => handleEdit(user)}>
                        <FaRegEdit className="text-green-500 text-[20px] pl-1" />Edit
                      </a>
                    </li>
                    <li>
                      <a onClick={() => handleDelete(user.id)}>
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

          {isModalOpen && (
            <dialog id="" className="modal w-full" open>
              <form onSubmit={handleEditSave} >
                <div className="modal-box px-13 ">
                  <div className="flex justify-between items-center  mb-2">
                    <p className="text-2xl">
                      <b>Edit User</b>
                    </p>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn btn-sm btn-circle btn-ghost text-3xl"
                    >
                      <IoClose />
                    </button>
                  </div>

                  {/* Form fields */}



                  <input
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="username"
                      type="hidden"
                      placeholder="Enter name"
                      value={editId}
                      onChange={(e) => setEditId(e.target.value)}
                    />


                  <div className="w-full max-w-md mx-auto mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      User Name
                    </label>
                    <input
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="username"
                      type="text"
                      placeholder="Enter name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />

                  </div>

                  <div className="w-full max-w-md mx-auto mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      User Phone Number
                    </label>
                    <input
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="usernumber"
                      type="number"
                      placeholder="Enter your number"
                      value={editPhone} onChange={(e) => setEditPhone(e.target.value)}
                    />
                    {/* {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone[0]}</p>
                )} */}
                  </div>

                  <div className="w-full max-w-md mx-auto mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      User Mail
                    </label>
                    <input
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="useremail"
                      type="email"
                      placeholder="Enter your email"
                      value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                    />
                    {/* {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email[0]}</p>
                )} */}
                  </div>

                  <div className="w-full max-w-md mx-auto mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      User Password
                    </label>
                    <input
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"

                      type="password"
                      placeholder="Enter password"
                      value={editPassword} onChange={(e) => setEditPassword(e.target.value)}
                    />
                    {/* {errors.pass && (
                  <p className="text-red-500 text-sm">{errors.pass[0]}</p>
                )} */}
                  </div>

                  <div className="w-full max-w-md mx-auto mb-4">
                    <label className="text-gray-700 text-sm font-bold mb-2">
                      Confirm Password
                    </label>
                    <input
                      className="shadow border rounded w-full py-2 px-3 text-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"

                      type="password"
                      placeholder="Confirm password"
                      value={editConfirmPassword} onChange={(e) => setEditConfirmPassword(e.target.value)}
                    />

                  </div>

                  {/* Modal action buttons */}
                  <div className="modal-action ">
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
                </div>
              </form>
            </dialog>
          )}
        </div>
      </div>

     
    </div>
  );
};

export default User;