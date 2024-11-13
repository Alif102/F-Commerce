import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ImSpinner10 } from "react-icons/im";

const Profile = ({ userInfo , onUpdateUserInfo  }) => {
  console.log(userInfo);
  const fileInputRef = useRef(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [packageName, setPackageName] = useState('');
  const [createAt, setCreateAt] = useState('');
  const [referral, setReferral] = useState(''); 
  const [pic, setPic] = useState(null);
  const [picUrl, setPicUrl] = useState(''); // Added to store the object URL
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handleErrors = (newErrors) => {
    setErrors(newErrors);
  };

  useEffect(() => {
    // Populate the state with the initial values from userInfo
    if (userInfo) {
      setName(userInfo.name || '');
      setPhone(userInfo.phone || '');
      setEmail(userInfo.email || '');
      setPackageName(userInfo.package_name || '');
      setCreateAt(userInfo.created_at || '');
      setReferral(userInfo.referral_link || 'null');
      setPic(userInfo.pic || null);
    }
  }, [userInfo]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file); 
    if (file) {
      setPic(file);
      setPicUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (pic) {
      formData.append('pic', pic);
    }
    formData.append('user_id', userId);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    setLoading(true);
    try {
      const response = await axios.post('https://admin.ezicalc.com/api/profile/update', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      // ()
      console.log(response);
      const newErrors = response.data.error || {};
      setErrors(newErrors);
      handleErrors(newErrors);

      if (response.data.error) {
        toast.error(Object.keys(response.data.error).map((field) => ` ${response.data.error[field][0]}`));
      }

      if (response.data.status) {
        onUpdateUserInfo();
       
        toast.success(response.data.message || 'Profile updated successfully!', {
          duration: 2000,
          position: 'top-left',
        });
        
      }
    } catch (error) {
      console.error("Error fetching API data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = new Date(createAt).toLocaleDateString('en-GB');

  useEffect(() => {
    return () => {
      if (picUrl) {
        URL.revokeObjectURL(picUrl);
      }
    };
  }, [picUrl]);

  return (
    <form onSubmit={handleSave} className="mx-4 md:mx-10">
      <div className="mb-5 w-full shadow-sm py-4 flex items-center pe-4 rounded-md border border-gray-300 justify-between">
        <h2 className="px-4 text-xl font-semibold">Add Business</h2>
      </div>

      <div className="border border-gray-300 rounded-md py-4 pe-4 mt-5 px-5 flex flex-col md:flex-row">
        <div className="w-[100%] md:w-[50%]">
          <div className="w-[100%] mb-4">
            <p>User Name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" hover:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm rounded-md border border-gray-300 md:w-[90%] w-[100%] p-2"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
          </div>
         

          <div className="w-[100%] mb-4">
            <p>Phone Number</p>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="hover:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm rounded-md border border-gray-300 md:w-[90%] w-[100%] p-2"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone[0]}</p>}
          </div>

          <div className="w-[100%] mb-4">
            <p>Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="hover:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm rounded-md border border-gray-300 md:w-[90%] w-[100%] p-2"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between justify-center w-[100%] md:w-[50%]">
        <div className="mb-4 flex flex-col items-center mt-5 md:mt-0">
      <p>Profile Photo</p>
      <div className="mt-5">
        <div  onClick={handleButtonClick}
          className="w-40 h-40 rounded-full bg-gray-100 shadow-lg"
          style={{
            backgroundImage: `url(${picUrl ? picUrl : `https://admin.ezicalc.com/public/storage/user/${pic}`})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef} 
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="w-20 h-8 bg-[#28DEFC] mt-4 text-white rounded"
          onClick={handleButtonClick}
        >
          <b>Upload</b>
        </button>
      </div>
    </div>

          <div className="mb-4 mt-5 md:mt-0">
            <p>Joined at : {formattedDate}</p>
            <p>Package : {packageName} </p>
          </div>
        </div>
      </div>

      <div className="shadow-sm rounded-md border border-gray-300 py-4 pe-4 mt-5 px-5">
        <div className="w-[100%] mb-4 flex items-center gap-4">
          <p>Referral Link</p>
          <input value={referral}
            type="text"
            className="hover:border-blue-500 focus:outline-none focus:ring-blue-500 shadow-sm rounded-md border border-gray-300 p-2 md:w-[40%] w-[100%] py-2"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center mt-5 justify-end">
        <button
          className="bg-[#28DEFC] text-white font-semibold py-3 px-6 rounded flex items-center"
          disabled={loading}
        >
          {loading && <ImSpinner10 className="animate-spin mr-2" />}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
};

export default Profile;
