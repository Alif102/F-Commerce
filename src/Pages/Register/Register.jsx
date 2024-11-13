import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import regilogo from "../../../public/assets/pos-logo.png";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import the nprogress CSS

const Register = ({pkg}) => {
  // const location = useLocation();
  //   const { pkg } = location.state || {};
    
  //   const package_id = pkg?.id;
    
  //   console.log(package_id); 
  // const package_id = pkg.id
  console.log(pkg); 
  // console.log(package_id); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    business_name: "",
    package_id: "",
    pass: "",
    confirm_pass: "",
  });
  const [errors, setErrors] = useState({});

  const handlePasswordToggle = () => setShowPassword(!showPassword);
  const handleConfirmPasswordToggle = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const navigate = useNavigate();
  const [phone, setPhone] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    NProgress.start(); // Start the progress bar

    try {
      const response = await axios.post(
        "https://admin.ezicalc.com/api/register",
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          business_name: formData.business_name,
          package_id: null,
          pass: formData.pass,
          confirm_pass: formData.confirm_pass,
        }
      );

      if (response.data.status) {
        console.log("Registration successful:", response.data);

        setPhone(response.data.data.phone);

        localStorage.setItem("phone", response.data.data.phone);
        localStorage.setItem("otp", response.data.data.otp);

        setFormData({
          name: "",
          phone: "",
          email: "",
          business_name: "",
          package_id: "",
          pass: "",
          confirm_pass: "",
        });

        navigate("/otp");
      } else {
        setErrors(response.data.error);
        console.log(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrors(error.response.data.error);
      } else {
        console.error("There was an error!", error);
      }
    } finally {
      NProgress.done(); 
    }
  };


  return (

    
    <div>
      <section className=" relative">
      <div className="absolute top-10 left-0 -z-10 overflow-hidden">
    <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white text-sm font-medium p-20 rounded-full shadow-lg transform -translate-x-1/2">
      {/* Half bubble content */}
    </div>
  </div>
        <div className="flex flex-col items-center justify-center px-6 py-8 mb-5 mx-auto  lg:py-0 ">
          <img className="mb-5 mt-10 w-48" src={regilogo} alt="regi" />
          <div className="w-full bg-white rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form className="space-y-1 md:space-y-3" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                   Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg custom-shadow focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition duration-200 ease-in-out ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="business_name"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg custom-shadow focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition duration-200 ease-in-out ${
                      errors.business_name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.business_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_name[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg custom-shadow focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition duration-200 ease-in-out ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg custom-shadow focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition duration-200 ease-in-out ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email[0]}
                    </p>
                  )}
                </div>
               

                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <label
                      htmlFor="pass"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="pass"
                      value={formData.pass}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg custom-shadow focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition duration-200 ease-in-out ${
                        errors.pass ? "border-red-500" : ""
                      }`}
                    />
                    {errors.pass && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pass[0]}
                      </p>
                    )}
                    <span
                      onClick={handlePasswordToggle}
                      className="absolute inset-y-0 right-2 top-10 transform -translate-y-1/2 flex items-center pr-3 cursor-pointer"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-gray-500" />
                      ) : (
                        <FaEye className="text-gray-500" />
                      )}
                    </span>
                  </div>
                  <div className="relative flex-1 mb-5">
                    <label
                      htmlFor="confirm_pass"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm_pass"
                      value={formData.confirm_pass}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg custom-shadow focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition duration-200 ease-in-out ${
                        errors.confirm_pass ? "border-red-500" : ""
                      }`}
                    />
                    {errors.confirm_pass && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirm_pass[0]}
                      </p>
                    )}
                    <span
                      onClick={handleConfirmPasswordToggle}
                      className="absolute inset-y-0 right-2 top-10 transform -translate-y-1/2 flex items-center pr-3 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-gray-500" />
                      ) : (
                        <FaEye className="text-gray-500" />
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#3AD5EA] btn w-full text-white px-3 py-2 hover:text-blue-600 hover:bg-white"
                >
                  Sign Up
                </button>

                <h2 className="text-center my-3">Or</h2>
                  <Link to='/login'>
                    <button className="btn bg-[#696FC4] w-full text-white px-3 py-2 hover:text-blue-600 hover:bg-white">
                      Log In
                    </button>
                  </Link>
              </form>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 -z-10 overflow-hidden">
    <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white text-sm font-medium p-20 rounded-full shadow-lg transform translate-x-1/2">
      {/* Half bubble content */}
    </div>
  </div>
      </section>
    </div>
  );
};

export default Register;
