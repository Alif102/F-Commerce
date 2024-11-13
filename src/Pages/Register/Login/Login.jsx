import { useState , useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import regilogo from "../../../../public/assets/pos-logo.png";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ImSpinner10 } from "react-icons/im";
import NProgress from 'nprogress'; // Import NProgress
import 'nprogress/nprogress.css'; // Import NProgress styles

import { useNavigate } from "react-router-dom";


const Login = ({userInfo}) => {
  console.log(userInfo)



  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state


  const [user, setUser] = useState('');

  const [formData, setFormData] = useState({
    phone: "",
    pass: "",
  });
  const [errors, setErrors] = useState({});

  const handlePasswordToggle = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

 
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const phone_back = urlParams.get('phone');
    const password_back = urlParams.get('password');
  
    if (phone_back && password_back) {
      const login = async () => {
        try {
          const response = await axios.post("https://admin.ezicalc.com/api/login", {
            phone: phone_back,
            pass: password_back, // Pass URL parameters in the request
          });
  
          if (response.data.status) {
            console.log("Login success:", response.data.data);
          
            // Set user data from the response
            setUser(response.data.data);

            console.log(response.data.data);
            localStorage.setItem('userId', response.data.data.id);
            localStorage.setItem('clientId', response.data.data.client_id);
            localStorage.setItem('token', response.data.data.token);
          
            // Retrieve and log the token from localStorage
            const token = localStorage.getItem('token'); 
            console.log("Token stored:", token);
          
            setLoading(false);
            NProgress.done();
          
            // Check if userInfo is null or not
            // const userInfo = response.data.data; // Assuming this holds the user information
            if (userInfo?.package_id === null) {
              console.log("Navigating to subscription...");
              window.location.href = "/subscription";
            } else {
              console.log("Navigating to dashboard...");
              window.location.href = "/dashboard";
            }
          
            console.log("Navigation triggered.");
          }
           else {
            const errorMessage = response.data.message || 'Phone Number or Password are incorrect';
  
            setErrors(response.data.error || { error: errorMessage });
  
            Swal.fire({
              text: errorMessage,
              icon: 'error',
              timer: 2000,
              position: 'top-end',
            });
  
            setLoading(false);
            NProgress.done();
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.error) {
            setErrors(error.response.data.error);
          } else {
            console.error("There was an error!", error);
          }
          setLoading(false);
          NProgress.done();
        }
      };
  
      // Call the login function when the URL parameters are present
      login();
    }
  }, []);
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    NProgress.start();
    // localStorage.clear();
  
    try {
      const response = await axios.post("https://admin.ezicalc.com/api/login", {
        phone: formData.phone,
        pass: formData.pass,

        // phone: '01724171556',
        // pass: '111111',
      });
  
      if (response.data.status) {
        console.log(response.data.data);
  
        setUser(response.data.data);
        console.log(user); // Note: This will log the previous state due to async updates
        localStorage.setItem('userId', response.data.data.id);
        localStorage.setItem('clientId', response.data.data.client_id);
        localStorage.setItem('token', response.data.data.token);
  

        const token = localStorage.getItem('token'); 
        console.log(token);

        setLoading(false);
        NProgress.done(); 
  
        console.log("Navigating to dashboard...");
        // navigate("/dashboard" ) ;
        if (userInfo?.package_id === null) {
          console.log("Navigating to subscription...");
          window.location.href = "/subscription";
        } else {
          console.log("Navigating to dashboard...");
          window.location.href = "/dashboard";
        }

        console.log("Navigation triggered.");
      } else {
        const errorMessage = response.data.message || 'Phone Number or Password are incorrect';
  
        setErrors(response.data.error || { error: errorMessage });
  
        Swal.fire({
          text: errorMessage,
          icon: 'error',
          timer: 2000,
          position: 'top-end',
        });
  
        setLoading(false);
        NProgress.done();
      }
  
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrors(error.response.data.error);
      } else {
        console.error("There was an error!", error);
      }
      setLoading(false);
      NProgress.done();
    }
  };
  
  console.log(user);

  useEffect(() => {
    if (user) {


      localStorage.setItem('userId', user.user_id);
      localStorage.setItem('clientId', user.client_id);
      localStorage.setItem('token', user.token);

      console.log('User state updated, navigating to dashboard...');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div>
      <section className=" relative mt-36 md:mt-0">

      <div className="absolute top-10 left-0 -z-10 overflow-hidden">
    <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white text-sm font-medium p-20 rounded-full shadow-lg transform -translate-x-1/2">
      {/* Half bubble content */}
    </div>
  </div>
        <div className="flex flex-col items-center justify-center px-6 py-8  mx-auto md:h-screen lg:py-0 ">
          <img className="mb-5 w-48" src={regilogo} alt="regi" />
          <div className="w-full bg-white rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form className="space-y-1 md:space-y-3" onSubmit={handleSubmit}>
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
                    autoComplete="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg custom-shadow focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition duration-200 ease-in-out ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && <p className="text-red-500 mt-1 text-sm">{errors.phone[0]}</p>}
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
                      autoComplete="current-password"
                      value={formData.pass}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg custom-shadow focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition duration-200 ease-in-out ${errors.pass ? "border-red-500" : ""}`}
                    />
                    {errors.pass && <p className="text-red-500 mt-1 text-sm">{errors.pass[0]}</p>}

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
                </div>

                <div className="">
                  <button
                    type="submit"
                    className="btn bg-[#696FC4] mt-6 w-full text-white px-3 py-2 hover:text-blue-600 hover:bg-white flex items-center justify-center"
                    // disabled={loading} 
                  >
                    {loading ? (
                      <ImSpinner10 className="animate-spin mr-2" /> 
                    ) : (
                      'Log In'
                    )}
                  </button>
                  <h2 className="text-center my-3">Or</h2>
                  <Link to='/register'>
                    <button
                      type="submit"
                      className="btn bg-[#3AD5EA] w-full text-white px-3 py-2 hover:text-blue-600 hover:bg-white"
                    >
                      Sign Up
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="absolute bottom-11 right-0 -z-10 overflow-hidden">
    <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white text-sm font-medium p-20 rounded-full shadow-lg transform translate-x-1/2">
      {/* Half bubble content */}
    </div>
  </div>
      </section>
    </div>
  );
};

export default Login;
